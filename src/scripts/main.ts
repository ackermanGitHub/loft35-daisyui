// open left slider with js
function openLeftSlider() {
  const slider = document.getElementById(
    'left-slider'
  ) as HTMLDivElement | null;
  if (!slider) return;
  slider.classList.remove('close');
  // setTimeout(() => {
  //     slider.classList.remove("close");
  //     slider.classList.add("open");
  // })
  slider.classList.add('open');
}
const body = document.querySelector('body');
if (body) {
  body.addEventListener('click', function (e) {
    if (e.x < 100) {
      openLeftSlider();
    }
  });
}
