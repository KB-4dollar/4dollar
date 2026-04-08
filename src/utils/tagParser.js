const TAG_ALLOWED_CHARACTER_REGEX = /[^#\s0-9A-Za-z가-힣]/g;
const TAG_CONTENT_REGEX = /^[0-9A-Za-z가-힣]+$/;

export const sanitizeTagInput = (value = '') =>
  String(value).replace(TAG_ALLOWED_CHARACTER_REGEX, '');

export const parseHashTags = (value = '') => {
  const normalizedValue = Array.isArray(value) ? value.join(' ') : String(value);
  const sanitizedValue = sanitizeTagInput(normalizedValue);
  const rawTags = sanitizedValue.split(/[#\s]+/);
  const parsedTags = [];
  const seenTags = new Set();

  rawTags.forEach((tag) => {
    const nextTag = tag.trim();

    if (!nextTag || !TAG_CONTENT_REGEX.test(nextTag) || seenTags.has(nextTag)) {
      return;
    }

    seenTags.add(nextTag);
    parsedTags.push(nextTag);
  });

  return parsedTags;
};
