$(function () {
  const loaderVideos = $(".videos-container .loader");
  const loaderLatestvideos = $(".latest-videos-container .loader");

  const items = $("#carouselExampleControls .carousel-inner");
  const videos = $(".videos-container");
  const latestVideos = $(".latest-videos-container");

  // HELPERS
  function updateDOM(element, markup, which) {
    element.append(markup);

    if (which === "quotes")
      $("#carouselExampleControls .loader").addClass("hidden");
    else if (which === "videos") loaderVideos.addClass("hidden");
    else loaderLatestvideos.addClass("hidden");
  }

  function generateStars(stars) {
    let markup = "";
    let i = 0;
    for (i = 0; i < stars; i++) {
      markup += ` <img
    class="img-fluid h-50"
    src="assets/images/star_on.png"
    alt=""
  />`;
    }
    for (; i < 5; i++)
      markup += `<img
      class="img-fluid h-50"
      src="assets/images/star_off.png"
      alt=""
    />`;

    return markup;
  }

  // QUOTES
  function loadQuotes() {
    $.get(`https://smileschool-api.hbtn.info/quotes`, function (data) {
      data.forEach((person, i) => {
        const markup = `
        <div class="carousel-item ${i === 0 ? "active" : ""}">
          <div class="quotes__item row flex-column flex-md-row">
              <img
                  class=
                  "
                  col-6 col-sm-2
                  mb-sm-auto mb-5
                  align-self-md-start align-self-center
                  rounded-circle
                  "
                  src=${person.pic_url}
                  alt=""
              />
              <div class="col-12 col-md-10 text-white">
              <p class="mb-3">
              « ${person.text} »
              </p>
              <div class="mb-3">${person.name}</div>
              <div>${person.title}</div>
              </div>
          </div>`;

        updateDOM(items, markup, "quotes");
      });
    });
  }

  items && loadQuotes();

  function loadVideos(url, videos, which) {
    $.get(url, function (data) {
      data.forEach((video, idx) => {
        let stars = generateStars(video.star);
        const markup = `<div class="carousel-item ${idx === 0 ? "active" : ""}">
          <div class="col-md-4">
            <div class="card card-body">
              <div class="col position-relative">
                <img
                  class="w-100 img-fluid"
                  src=${video.thumb_url}
                  alt=""
                />
                <img
                  class="
                    img-fluid
                    h-50
                    position-absolute
                    rounded-circle
                  "
                  src="assets/images/play.png"
                  alt=""
                />
              </div>
              <div class="col">
                <h4>${video.title}</h4>
                <p>
                  ${video["sub-title"]}
                </p>
                <div>
                  <img
                    class="img-fluid w-25 rounded-circle"
                    src=${video.author_pic_url}
                    alt=""
                  />
                  <span class="ml-2" style="color: #c271ff"
                    >${video.author}</span
                  >
                </div>
                <div class="d-flex justify-content-between">
                  <div>
                    ${stars}
                  </div>
                  <span class="mr-3" style="color: #c271ff">${
                    video.duration
                  }</span>
                </div>
              </div>
            </div>
          </div>
        </div>`;

        updateDOM(videos, markup, which);
      });
    });
  }

  videos &&
    loadVideos(
      `https://smileschool-api.hbtn.info/popular-tutorials`,
      videos,
      "videos"
    );
  latestVideos &&
    loadVideos(
      `https://smileschool-api.hbtn.info/latest-videos`,
      latestVideos,
      "latest videos"
    );

  $.get(`https://smileschool-api.hbtn.info/courses`, function (data) {
    const { sorts, topics } = data;
    let topicOptions = "";
    let sortOptions = "";
    topics.forEach((topic, i) => {
      topicOptions += `
      <option ${i === 0 ? "selected" : ""} value=${i}>${topic}</option>
      `;
    });

    sorts.forEach((sort, i) => {
      sortOptions += `
      <option ${i === 0 ? "selected" : ""} value=${i}>${sort}</option>
      `;
    });

    $(".topic").html(() => topicOptions);
    $(".sort-by").html(() => sortOptions);
  });

  function renderVideos(url) {
    $(".videos-results  .loader").removeClass("hidden");

    $.get(url, function ({ courses }) {
      let markup = "";
      courses.forEach((course, i) => {
        markup += `<div class="row row-cols-1  w-25  p-4">
        <div class="card card-body p-1">
      <div class="col position-relative w-100">
        <img
          class="img-fluid w-100"
          src=${course.thumb_url}
          alt=""
        />
        <img
          class="img-fluid h-50 position-absolute rounded-circle"
          src="assets/images/play.png"
          alt=""
        />
      </div>
      <div class="col">
        <h4 class="">${course.title}</h4>
        <p class="">
          ${course["sub-title"]}
        </p>
        <div class="d-flex align-items-center">
          <img
            class="img-fluid w-25 rounded-circle"
            src=${course.author_pic_url}
            alt=""
          />
          <span class="ml-2 text-nowrap" style="color: #c271ff">${
            course.author
          }</span>
        </div>
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex align-items-end">
           ${generateStars(course.star)}
          </div>
          <span class="mr-3 align-self-end text-nowrap" style="color: #c271ff">${
            course.duration
          }</span>
        </div>
        </div>
      </div>
    </div>`;
      });
      $(".found-videos").html(
        () => `${courses.length} ${courses.length > 1 ? "videos" : "video"}`
      );
      $(".courses-videos").html(() => markup);
      $(".videos-results .loader").addClass("hidden");
    });
  }
  $(".videos-results  .loader").removeClass("hidden");

  renderVideos(`https://smileschool-api.hbtn.info/courses`);

  function initVideos(e) {
    e.preventDefault();
    const keywords = $(".search-input").val();
    const topic = $(".topic option:selected").text();
    const sortBy = $(".sort-by option:selected").text();
    const url = `https://smileschool-api.hbtn.info/courses?q=${keywords}&sort=${sortBy}&topic=${topic}`;

    renderVideos(url);
  }

  $("form").submit(initVideos);
  $(".search-input").on("input", initVideos);
  $(".topic").change(initVideos);
  $(".sort-by").change(initVideos);

  $("head").append([
    $("<script>").attr({
      src: "myJqFile.js",
    }),
  ]);
});
