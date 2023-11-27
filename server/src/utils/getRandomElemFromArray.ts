export default function getRandomElemFromArray(arr) {
  const size = arr.length;
  const randomElem = arr[Math.floor(Math.random() * size)];
  return randomElem;
}
