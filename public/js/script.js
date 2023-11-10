"use strict";

// Show success message after article was published
const urlParams = new URLSearchParams(window.location.search);
const myPostParam = urlParams.get("post");

const successMessage = document.querySelector("#success--message");
const check = document.querySelector(".check");
const closeIcon = document.querySelector(".close--btn");
const text2 = document.querySelector(".text-2");

let timer1;

if (myPostParam) {
  successMessage.classList.add("on");
  text2.textContent = "Your article has been posted!";
  timer1 = setTimeout(() => {
    successMessage.classList.remove("on");
  }, 5000);
}

// Show success message after article was deleted
const myDeleteParam = urlParams.get("delete");
if (myDeleteParam) {
  successMessage.classList.add("on");
  text2.textContent = "Your article has been deleted!";
  successMessage.style.borderLeft = "6px solid #bb2525";
  check.style.backgroundColor = "#bb2525";
  timer1 = setTimeout(() => {
    successMessage.classList.remove("on");
  }, 5000);
}

const myUpdateParam = urlParams.get("update");
if (myUpdateParam) {
  successMessage.classList.add("on");
  text2.textContent = "Your article has been updated!";
  timer1 = setTimeout(() => {
    successMessage.classList.remove("on");
  }, 5000);
}

// Close notification
if (closeIcon)
  closeIcon.addEventListener("click", () => {
    successMessage.classList.remove("on");

    clearTimeout(timer1);
  });

const articleDelete = document.querySelector("#article--delete");
const hiddenArticleID = document.querySelector("#hidden--input");
if (articleDelete) {
  articleDelete.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const formData = await fetch(`/edit/post/${hiddenArticleID.value}`, {
        method: "DELETE",
      });
      const responseData = await formData.json();
      if (responseData.message === "success") {
        window.location.href = "/?delete=true";
      }
    } catch (error) {
      console.log(error);
    }
  });
}

const commentDeleteButtons = document.querySelectorAll(".comment--remove--btn");

commentDeleteButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const commentId = button.parentElement.querySelector(
      "#hidden--input--comment--id"
    ).value;
    try {
      console.log(commentId);
      const response = await fetch(`/post/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (responseData.message === "success") {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  });
});
