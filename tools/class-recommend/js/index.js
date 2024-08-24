function updateAttitudeLabel() {
  const attitude = document.getElementById('attitude').value;
  const label = document.getElementById('attitudeLabel');
  label.textContent = `${attitude} ${getAttitudeDescription(attitude)}`;
}

function getAttitudeDescription(attitude) {
  switch (parseInt(attitude)) {
      case -2: return '非常讨厌';
      case -1: return '不喜欢';
      case 0: return '一般';
      case 1: return '喜欢';
      case 2: return '非常喜欢';
      default: return '';
  }
}

async function submitReview(event) {
  event.preventDefault();

  const reviewData = {
      classID: document.getElementById('classID').value,
      attitude: document.getElementById('attitude').value,
      review: document.getElementById('review').value,
  };
  if (!reviewData.classID || +reviewData.classID <= 0) {
    alert('你选择的课程有误！');
    return;
  } 
  if ([-2, -1, 0, 1, 2].includes(+reviewData.review)) {
    alert('你的打分有误！');
    return;
  } 
  if (reviewData.review.length > 100) {
    alert('你的评论太长了！');
    return;
  } 

  const response = await fetch('/api/classInfo?action=set', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
  });

  const result = await response.json();
  if (result.success) {
      alert('提交成功，刷新页面以查看更新。');
  } else {
      alert('提交失败，请与我们联系。错误信息：' + result.error);
  }
}



class CustomButtonRenderer {
  eGui;

  init(params) {
    this.eGui = document.createElement('div');
    this.eGui.style.display = 'flex'; 
    this.eGui.style.height = "100%";
    this.eGui.style.width = "100%";
    const button = document.createElement('button');
    button.innerHTML = '选择该课程';
    button.style.height = "100%";
    button.style.width = "100%";
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center'; 
    button.addEventListener('click', () => this.showCourseCard(params.data));
    this.eGui.appendChild(button); 
  }

  getGui() {
    return this.eGui;
  }

  showCourseCard(courseData) {
    document.querySelector("#classID").value = courseData["ID"];
    document.querySelector("#className").value = courseData["课程名称"];
    let url = '/api/classInfo?action=get&data=classReviews&classID=' + courseData["ID"];
    if (!classReviewsApi) {
      document.querySelector(".card2").style.display = "flex";
      classReviewsApi = agGrid.createGrid(classReviewsGrid, classReviewsGridOptions);
    }
    document.getElementById('addReview').scrollIntoView({ behavior: 'smooth', block: 'start' });
    fetch(url)
      .then(response => response.json())
      .then(data => classReviewsApi.setGridOption('rowData', data))
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }
}

const classInfoGridOptions = {
    rowData : [],
    columnDefs: [
      // { field: "ID" },
      { field: '', headerName: '选择该课程', cellRenderer: CustomButtonRenderer, sortable: false},
      { field: "课程名称", filter: true},
      { field: "开课时间", sortable: true, sort: "desc"},
      { field: "总学分"},
      { field: "总学时"},
      { field: "课程分类"},
      { field: "授课方式"},
    ],
    pagination: true,
  };

  const classReviewsGridOptions = {
    rowData : [],
    columnDefs: [
      // { field: "ID" },
      // { field: "对应课程ID"},
      { field: "评价时间", filter: true, sortable: true, sort: "desc", flex: 1},
      { field: "态度", flex: 1,
        valueFormatter: p => {
          let rating = p.value;
          if (rating === -2) {
            emojiRating = '👎👎'; // 两个 👎
          } else if (rating === -1) {
            emojiRating = '👎';   // 一个 👎
          } else if (rating === 0) {
            emojiRating = '👊';   // 一个 👊
          } else if (rating === 1) {
            emojiRating = '👍';   // 一个 👍
          } else if (rating === 2) {
            emojiRating = '👍👍'; // 两个 👍
          } else {
            emojiRating = ''; // 未知评分
          }
          return emojiRating;
        },
      },
      { field: "评价", flex: 3},
    ],
    pagination: true,
  };

  const classInfoGrid = document.querySelector('#classInfo');
  let classInfoApi = agGrid.createGrid(classInfoGrid, classInfoGridOptions);
  const classReviewsGrid = document.querySelector('#classReviews');
  let classReviewsApi;

  fetch('/api/classInfo?action=get&data=classInfo')
  .then(response => response.json())
  .then(data => classInfoApi.setGridOption('rowData', data))
  .catch(error => {
    console.error('Error fetching data:', error);
  });