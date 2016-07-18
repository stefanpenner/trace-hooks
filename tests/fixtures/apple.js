var foo = function() {
  return 'asdf';
}

module.exports = Apple;
function Apple(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

Apple.prototype.fullName = function() {
  return this.firstName + ' ' + this.lastName;
}

