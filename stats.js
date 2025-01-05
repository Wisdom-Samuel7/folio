const skillPercentages = document.querySelectorAll('.skill-percentage');

function animateProgress(element) {
  const percentage = parseInt(element.dataset.percent);
  const circle = element.parentElement.querySelector('.circular-fg');
  const circumference = 282.74; // 2 * Math.PI * 45 (radius)
  const offset = circumference - (percentage / 100) * circumference;
  circle.style.strokeDashoffset = offset;
}

function handleIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateProgress(entry.target);
      observer.unobserve(entry.target); // Stop observing after animation
    }
  });
}

const observer = new IntersectionObserver(handleIntersection, { threshold: 0.5 });

skillPercentages.forEach(percentage => {
  observer.observe(percentage);
});


// const histogramBars = document.querySelectorAll('.relative > div');

// function animateHistogram(element) {
//     const percentage = parseInt(element.dataset.percentage);
//     element.style.width = percentage + "%"
// }

// function handleIntersection(entries, observer) {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       animateHistogram(entry.target);
//       observer.unobserve(entry.target); // Important for performance
//     }
//   });
// }

// const obs = new IntersectionObserver(handleIntersection, { threshold: 0.5 });

// histogramBars.forEach(bar => {
//   obs.observe(bar);
// });