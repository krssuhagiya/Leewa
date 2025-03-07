document.addEventListener("DOMContentLoaded", function () {
    const slideshow = document.getElementById("slideshow");
    const slides = slideshow.children;
    const totalSlides = slides.length;
    let index = 0;
  
    function showSlide(i) {
      index = (i + totalSlides) % totalSlides;
      slideshow.style.transform = `translateX(-${index * 100}%)`;
    }
  
    document
      .getElementById("prev")
      .addEventListener("click", () => showSlide(index - 1));
    document
      .getElementById("next")
      .addEventListener("click", () => showSlide(index + 1));
  
    setInterval(() => showSlide(index + 1), 6000);
  });
  