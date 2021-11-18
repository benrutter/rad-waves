class Something {

  constructor(context, message) {
    this.message = message;
    this.context = context;
  }

  showMessage() {
    this.huh = this.context.add.text(100, 100, 'Hello world!');
  }

  changeMessage() {
    this.huh.setText('wwwhhaat bra?');
  }
}
