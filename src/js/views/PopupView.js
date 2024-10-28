class PopupView {
  _dialog;
  constructor() {
    this._dialog = document.getElementById('ride-popup');
  }
  open(submitHandler, closeHandler) {
    this._dialog.showModal();
    this._dialog.addEventListener('click', e => {
      if (
        e.target.className === 'ride-popup__close--cross' ||
        e.target.id === 'ride-popup'
      ) {
        closeHandler();
        this._dialog.close();
      }
    });
    this._dialog.addEventListener('submit', e => {
      e.preventDefault();
      submitHandler(e.target);
      this._dialog.close();
    });
  }
}
export default new PopupView();
