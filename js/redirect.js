function isIOS() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}
function startIThrown(){
    try {
        document.location = iosUrl;
    } catch(e) { /* noop - stay on web page */ }
}
if( isIOS() ) {
    startIThrown();
}
