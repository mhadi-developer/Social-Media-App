
"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import "../assets/css/create-post.css";

/**
 * CreatePost
 * An Instagram-style "new post" flow: choose a post type (photo/video or
 * text), attach and preview media, write a caption, set location and
 * a few sharing options, then publish.
 *
 * Form state (caption, location, toggles, text content) is managed with
 * react-hook-form. Media files are kept in local state because they are
 * File objects with object-URL previews rather than plain form values,
 * but a hidden RHF field ("media") is kept in sync so the "at least one
 * file for a media post" rule can be validated through the same form.
 */

const MAX_TEXT_LENGTH = 500;
const MAX_CAPTION_LENGTH = 2200;
const ACCEPTED_TYPES = ["image/*", "video/*"];

type PostType = "media" | "text";

type MediaItem = {
  id: string;
  file: File;
  url: string;
  kind: "image" | "video";
  altText: string;
};

type CreatePostFormValues = {
  postType: PostType;
  caption: string;
  textContent: string;
  location: string;
  hideLikeCount: boolean;
  turnOffCommenting: boolean;
  media: string; // hidden field: joined media ids, used only for validation
};

export type CreatePostSubmitPayload = {
  postType: PostType;
  caption: string;
  textContent: string;
  location: string;
  hideLikeCount: boolean;
  turnOffCommenting: boolean;
  media: { file: File; kind: "image" | "video"; altText: string }[];
};

type CreatePostProps = {
  currentUser?: { name: string; initials?: string };
  onClose?: () => void;
  onSubmit?: (payload: CreatePostSubmitPayload) => Promise<void> | void;
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function kindFromFile(file: File): "image" | "video" {
  return file.type.startsWith("video") ? "video" : "image";
}

export default function CreatePost({
  currentUser = { name: "you" },
  onClose,
  onSubmit,
}: CreatePostProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showAltEditor, setShowAltEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreatePostFormValues>({
    mode: "onChange",
    defaultValues: {
      postType: "media",
      caption: "",
      textContent: "",
      location: "",
      hideLikeCount: false,
      turnOffCommenting: false,
      media: "",
    },
  });

  const postType = watch("postType");
  const caption = watch("caption");
  const textContent = watch("textContent");
  const location = watch("location");
  const hideLikeCount = watch("hideLikeCount");
  const turnOffCommenting = watch("turnOffCommenting");

  const revokeAll = useCallback((items: MediaItem[]) => {
    items.forEach((item) => URL.revokeObjectURL(item.url));
  }, []);

  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const incoming = Array.from(fileList);
      const valid = incoming.filter(
        (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
      );

      if (valid.length === 0) {
        setFileError("Only photos and videos are supported.");
        return;
      }

      const oversized = valid.find((f) => f.size > 100 * 1024 * 1024);
      if (oversized) {
        setFileError(`"${oversized.name}" is over the 100MB limit.`);
        return;
      }

      setFileError(null);

      const newItems: MediaItem[] = valid.map((file) => ({
        id: makeId(),
        file,
        url: URL.createObjectURL(file),
        kind: kindFromFile(file),
        altText: "",
      }));

      setMedia((prev) => {
        const next = [...prev, ...newItems].slice(0, 10);
        setValue("media", next.map((m) => m.id).join(","), {
          shouldValidate: true,
        });
        return next;
      });
      setActiveIndex((prev) => (media.length === 0 ? 0 : prev));
    },
    [media.length, setValue]
  );

  const removeMedia = useCallback(
    (id: string) => {
      setMedia((prev) => {
        const removed = prev.find((m) => m.id === id);
        if (removed) URL.revokeObjectURL(removed.url);
        const next = prev.filter((m) => m.id !== id);
        setValue("media", next.map((m) => m.id).join(","), {
          shouldValidate: true,
        });
        setActiveIndex((idx) => Math.max(0, Math.min(idx, next.length - 1)));
        return next;
      });
    },
    [setValue]
  );

  const updateAltText = useCallback((id: string, value: string) => {
    setMedia((prev) =>
      prev.map((m) => (m.id === id ? { ...m, altText: value } : m))
    );
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles]
  );

  const resetAll = useCallback(() => {
    revokeAll(media);
    setMedia([]);
    setActiveIndex(0);
    setFileError(null);
    setValue("media", "");
    setValue("caption", "");
    setValue("textContent", "");
    setValue("location", "");
    setValue("hideLikeCount", false);
    setValue("turnOffCommenting", false);
  }, [media, revokeAll, setValue]);

  const handlePostTypeChange = useCallback(
    (type: PostType) => {
      setValue("postType", type, { shouldValidate: true });
    },
    [setValue]
  );

  const captionLength = caption?.length ?? 0;
  const textLength = textContent?.length ?? 0;

  const isMediaStepComplete = media.length > 0;
  const canGoToDetails = postType === "text" || isMediaStepComplete;

  const [step, setStep] = useState<"select" | "details">("select");

  const goToDetails = () => {
    if (postType === "text" || isMediaStepComplete) setStep("details");
  };

  const activeMedia = media[activeIndex];

  const submitDisabled = useMemo(() => {
    if (isSubmitting) return true;
    if (postType === "media") return media.length === 0;
    return textContent.trim().length === 0 || textLength > MAX_TEXT_LENGTH;
  }, [isSubmitting, postType, media.length, textContent, textLength]);

  const onValidSubmit = handleSubmit(async (values) => {
    if (values.postType === "media" && media.length === 0) return;
    if (
      values.postType === "text" &&
      values.textContent.trim().length === 0
    )
      return;

    setIsSubmitting(true);
    setSubmitProgress(0);

    const payload: CreatePostSubmitPayload = {
      postType: values.postType,
      caption: values.caption,
      textContent: values.textContent,
      location: values.location,
      hideLikeCount: values.hideLikeCount,
      turnOffCommenting: values.turnOffCommenting,
      media: media.map((m) => ({
        file: m.file,
        kind: m.kind,
        altText: m.altText,
      })),
    };
    console.log({payload});
    
    // Simulated upload progress for UX; replace with real progress events
    // from your upload transport (fetch/XHR/presigned-URL uploader).
    const timer = setInterval(() => {
      setSubmitProgress((p) => Math.min(p + 12, 92));
    }, 120);

    try {
      await onSubmit?.(payload);
      setSubmitProgress(100);
    } finally {
      clearInterval(timer);
      setIsSubmitting(false);
      resetAll();
      setStep("select");
    }
  });

  return (
    <div className="cp-overlay" role="dialog" aria-modal="true" aria-label="Create new post">
      <div className="cp-modal">
        <header className="cp-header">
          {step === "details" ? (
            <button
              type="button"
              className="cp-header-btn cp-back"
              onClick={() => setStep("select")}
              aria-label="Back"
            >
              ‹
            </button>
          ) : (
            <button
              type="button"
              className="cp-header-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          )}

          <span className="cp-header-title">Create new post</span>

          {step === "select" ? (
            <button
              type="button"
              className="cp-header-btn cp-share"
              disabled={!canGoToDetails}
              onClick={goToDetails}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              className="cp-header-btn cp-share"
              disabled={submitDisabled}
              onClick={onValidSubmit}
            >
              Share
            </button>
          )}
        </header>

        <div className="cp-type-toggle">
          <button
            type="button"
            className={`cp-type-btn ${postType === "media" ? "active" : ""}`}
            onClick={() => handlePostTypeChange("media")}
          >
            📷 Photo / Video
          </button>
          <button
            type="button"
            className={`cp-type-btn ${postType === "text" ? "active" : ""}`}
            onClick={() => handlePostTypeChange("text")}
          >
            ✏️ Text post
          </button>
        </div>

        <input type="hidden" {...register("media")} />

        {step === "select" && postType === "media" && (
          <div className="cp-body">
            <div
              className={`cp-dropzone ${isDragging ? "cp-dragging" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                  fileInputRef.current?.click();
              }}
            >
              <div className="cp-dropzone-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="8.5" cy="10.5" r="1.5" />
                  <path d="M21 15l-5-5-9 9" />
                </svg>
              </div>
              <div className="cp-dropzone-title">
                {media.length > 0
                  ? `${media.length} file${media.length > 1 ? "s" : ""} selected`
                  : "Drag photos and videos here"}
              </div>
              <div className="cp-dropzone-sub">
                Up to 10 files · JPG, PNG, MP4, MOV · max 100MB each
              </div>
              <button
                type="button"
                className="cp-select-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                Select from computer
              </button>
              {fileError && <div className="cp-error">{fileError}</div>}
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                multiple
                className="cp-hidden-input"
                onChange={handleFileInputChange}
              />
            </div>

            {media.length > 0 && (
              <div style={{ padding: "0 16px 16px", display: "flex", gap: 8, flexWrap: "wrap" }}>
                {media.map((item) => (
                  <div key={item.id} className="cp-thumb active" style={{ position: "relative" }}>
                    {item.kind === "image" ? (
                      <img src={item.url} alt="" />
                    ) : (
                      <video src={item.url} muted />
                    )}
                    <button
                      type="button"
                      className="cp-media-remove"
                      style={{ width: 18, height: 18, top: 2, right: 2, fontSize: 10 }}
                      onClick={() => removeMedia(item.id)}
                      aria-label="Remove file"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === "select" && postType === "text" && (
          <div className="cp-body">
            <div className="cp-field-block" style={{ paddingTop: 16 }}>
              <textarea
                className="cp-text-post-area"
                placeholder="What's on your mind?"
                {...register("textContent", {
                  maxLength: MAX_TEXT_LENGTH,
                })}
              />
              <div
                className={`cp-char-count ${
                  textLength > MAX_TEXT_LENGTH
                    ? "cp-over-limit"
                    : textLength > MAX_TEXT_LENGTH - 40
                    ? "cp-near-limit"
                    : ""
                }`}
              >
                {textLength}/{MAX_TEXT_LENGTH}
              </div>
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="cp-body cp-body-split">
            {postType === "media" && (
              <div className="cp-media-pane">
                {activeMedia && (
                  <div className="cp-media-slide">
                    {activeMedia.kind === "image" ? (
                      <img src={activeMedia.url} alt={activeMedia.altText || "Post preview"} />
                    ) : (
                      <video src={activeMedia.url} controls />
                    )}
                  </div>
                )}

                {media.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="cp-media-nav cp-prev"
                      onClick={() =>
                        setActiveIndex((i) => (i - 1 + media.length) % media.length)
                      }
                      aria-label="Previous file"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="cp-media-nav cp-next"
                      onClick={() => setActiveIndex((i) => (i + 1) % media.length)}
                      aria-label="Next file"
                    >
                      ›
                    </button>
                    <div className="cp-dots">
                      {media.map((m, i) => (
                        <span
                          key={m.id}
                          className={`cp-dot ${i === activeIndex ? "active" : ""}`}
                        />
                      ))}
                    </div>
                  </>
                )}

                <button
                  type="button"
                  className="cp-media-remove"
                  onClick={() => activeMedia && removeMedia(activeMedia.id)}
                  aria-label="Remove current file"
                >
                  ✕
                </button>

                <button
                  type="button"
                  className="cp-media-add-more"
                  onClick={() => fileInputRef.current?.click()}
                >
                  + Add more
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  multiple
                  className="cp-hidden-input"
                  onChange={handleFileInputChange}
                />
              </div>
            )}

            <div className={`cp-details-pane ${postType === "text" ? "cp-full" : ""}`}>
              <div className="cp-user-row">
                <div className="cp-avatar">
                  {(currentUser.initials ?? currentUser.name.slice(0, 2)).toUpperCase()}
                </div>
                <span className="cp-username">{currentUser.name}</span>
              </div>

              <div className="cp-field-block">
                <textarea
                  className="cp-caption-area"
                  placeholder="Write a caption..."
                  {...register("caption", { maxLength: MAX_CAPTION_LENGTH })}
                />
                <div
                  className={`cp-char-count ${
                    captionLength > MAX_CAPTION_LENGTH - 100 ? "cp-near-limit" : ""
                  }`}
                >
                  {captionLength}/{MAX_CAPTION_LENGTH}
                </div>
              </div>

              <hr className="cp-divider" />

              <div
                className="cp-row-item"
                onClick={() => setShowLocationInput((v) => !v)}
              >
                <span className="cp-row-label">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                    <path d="M12 21s-7-6.1-7-11a7 7 0 1 1 14 0c0 4.9-7 11-7 11z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                  Add location
                </span>
                <span className="cp-row-chevron">{showLocationInput ? "︿" : "﹀"}</span>
              </div>
              {showLocationInput && (
                <div className="cp-location-input-wrap">
                  <input
                    className="cp-input"
                    placeholder="Search for a location"
                    {...register("location")}
                  />
                </div>
              )}

              {postType === "media" && (
                <>
                  <hr className="cp-divider" />
                  <div
                    className="cp-row-item"
                    onClick={() => setShowAltEditor((v) => !v)}
                  >
                    <span className="cp-row-label">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M7 15l3.5-4.5L13 14l2-2.5L19 15" />
                      </svg>
                      Accessibility (alt text)
                    </span>
                    <span className="cp-row-chevron">{showAltEditor ? "︿" : "﹀"}</span>
                  </div>
                  {showAltEditor && (
                    <div className="cp-alt-list">
                      {media.map((m, i) => (
                        <div className="cp-alt-item" key={m.id}>
                          <span>File {i + 1}</span>
                          <input
                            className="cp-input"
                            placeholder="Describe this photo or video"
                            value={m.altText}
                            onChange={(e) => updateAltText(m.id, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              <hr className="cp-divider" />

              <div className="cp-toggle-row">
                <span className="cp-row-label">Hide like and view counts</span>
                <button
                  type="button"
                  className={`cp-toggle ${hideLikeCount ? "on" : ""}`}
                  role="switch"
                  aria-checked={hideLikeCount}
                  onClick={() => setValue("hideLikeCount", !hideLikeCount)}
                >
                  <span className="cp-toggle-knob" />
                </button>
              </div>

              <div className="cp-toggle-row">
                <span className="cp-row-label">Turn off commenting</span>
                <button
                  type="button"
                  className={`cp-toggle ${turnOffCommenting ? "on" : ""}`}
                  role="switch"
                  aria-checked={turnOffCommenting}
                  onClick={() => setValue("turnOffCommenting", !turnOffCommenting)}
                >
                  <span className="cp-toggle-knob" />
                </button>
              </div>
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="cp-footer">
            <div className="cp-progress-track">
              <div
                className="cp-progress-fill"
                style={{ width: `${submitProgress}%` }}
              />
            </div>
            <span className="cp-progress-label">Sharing… {submitProgress}%</span>
          </div>
        )}
      </div>
    </div>
  );
}