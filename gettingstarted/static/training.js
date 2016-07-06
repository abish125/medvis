function return_target() {
      $.ajax({
          url: '../training/',
          type: "POST",
          data: {
              target: document.getElementById("target").value,
              csrfmiddlewaretoken: '{{ csrf_token }}'
          }, 
          success: function(response) {
              document.getElementById("answer").value = response;
          },
          //complete: function(response) {document.getElementById("answer").value = response;},
          error: function(xhr, textStatus, thrownError) {}
      });
  }