const toggleNav = (className: string, class1: string): void => {
  document.querySelector(`.${className}`)?.classList.toggle(class1);
  console.log("toggled");
};

export default toggleNav;
