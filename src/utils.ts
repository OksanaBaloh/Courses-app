export function getNumbers(from: number, to: number): number[] {
  const numbers = [];

  for (let n = from; n <= to; n += 1) {
    numbers.push(n);
  }

  return numbers;
}

const canPIP = () => ('pictureInPictureEnabled' in document
  && document.pictureInPictureEnabled);

const supportsModernPIP = () => {
  const video = document.createElement('video');

  return (
    canPIP()
    && video.requestPictureInPicture
    && typeof video.requestPictureInPicture === 'function'
  );
};

export const isInPIP = () => Boolean(document.pictureInPictureElement);

export const openPIP = async (video: any) => {
  if (isInPIP()) {
    return;
  }

  if (supportsModernPIP()) {
    await video.requestPictureInPicture();
  } else {
    await video.webkitSetPresentationMode('picture-in-picture');
  }
};

export const closePIP = async (video: any) => {
  if (!isInPIP()) {
    return;
  }

  if (supportsModernPIP()) {
    await document?.exitPictureInPicture();
  } else {
    await video.webkitSetPresentationMode('inline');
  }
};

