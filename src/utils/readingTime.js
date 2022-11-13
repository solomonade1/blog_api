const readingTime = (blog) => {
  const wordCount = blog.split(" ").length;
  const average = 200;
  const wordPerMinute = wordCount / average;
  const getCount = Math.ceil(wordPerMinute);
  return getCount;
};
module.exports = {readingTime}


