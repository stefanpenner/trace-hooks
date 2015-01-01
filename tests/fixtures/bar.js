function bar() {
  if (Math.random() > 0.8) {
    if (1) {
    } else {
    return 1+1;
    }
  } else {
    return 2+2;
  }
}
for (var i =0; i< 1000000; i++){
  bar();
}
