module.exports = {
  "Hello World" : function (browser) {
    browser
      .useXpath()
      .url('http://helloworld:3000/')
      .waitForElementVisible('//input[@id="filenameAdd"]', 10000)

      .execute(function () {
        // This is a hackash workaround to the fact that there's no easy way to
        // wait for the alert.
        addFile = function (){
          var fName = document.getElementById('filenameAdd').value;
          var body = document.getElementById('input').value;
          
          if(body === "" || fName === ""){
            window.alert("You must provide a file name and some data.");
            return;
          }

          sender.sendAsync("PUT", "/files/" + fName, body, function(request) {
            if (request.status === 200) {
              document.body.innerHTML += '<div id="alertPresent">File sent! You can now get it by its name.</div>';
            } else {
              window.alert("Failed to add file:\n" + request.responseText);
            }
          });          
        };
      })

      .setValue('//input[@id="filenameAdd"]', "marmots")
      .setValue('//textarea[@id="input"]', "https://erisindustries.com/")
      .click('(//button)[1]')
      .waitForElementPresent('//div[@id="alertPresent"]', 1000)
      .setValue('//input[@id="filenameGet"]', "marmots")
      .click('(//button)[2]')
      .assert.value('//textarea[@id="output"]', "https://erisindustries.com/")
      .end();
  }
};
