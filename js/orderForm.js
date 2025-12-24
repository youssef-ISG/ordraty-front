 $(document).ready(function () {
        const dateContainer = $("#date-pills-container");
        const dayNames = [
          "الأحد",
          "الإثنين",
          "الثلاثاء",
          "الأربعاء",
          "الخميس",
          "الجمعة",
          "السبت",
        ];

        dateContainer.empty();

        for (let i = 0; i < 7; i++) {
          let date = new Date();
          date.setDate(date.getDate() + i);

         
          let label =
            i === 0 ? "اليوم" : i === 1 ? "غداً" : dayNames[date.getDay()];
          let dayNum = date.getDate();
          let fullDate = date.toISOString().split("T")[0];

          let activeClass = i === 0 ? "active" : "";

          if (i === 0) $("#selected-delivery-date").val(fullDate);

          dateContainer.append(`
            <div class="date-pill-item ${activeClass}" data-date="${fullDate}">
                <span class="day-name">${label}</span>
                <span class="day-num">${dayNum}</span>
            </div>
        `);
        }

        $(document).on("click", ".date-pill-item", function () {
          $(".date-pill-item").removeClass("active");
          $(this).addClass("active");
          $("#selected-delivery-date").val($(this).data("date"));
        });

        $(document).on("click", ".time-card", function () {
          $(".time-card").removeClass("active");
          $(this).addClass("active");
          $("#time_shedule").val($(this).data("time"));
        });
      });