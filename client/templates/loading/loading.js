var message = '<p class="loading-message" style="font-size: 25px; font-weight: 300; color: white;">Now Loading.. Please Wait</p>';
var spinner = '<div class="sk-spinner sk-spinner-rotating-plane"></div>';

Template.loading.rendered = function () {
  if ( ! Session.get('loadingSplash') ) {
    this.loading = window.pleaseWait({
      // logo: '/images/scm_256.png',
      backgroundColor: '#54d6c2',
      loadingHtml: message + spinner
    });
    Session.set('loadingSplash', true); // just show loading splash once
  }
};

Template.loading.destroyed = function () {
  if ( this.loading ) {
      this.loading.finish();
  }
};

