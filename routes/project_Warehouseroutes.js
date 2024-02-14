const express = require("express");
const {
  getallProject_warehouse,
  getProject_warehouse,
  createProject_warehouse,
  updateProject_warehouse,
  deleteProject_warehouse,
  uploadprojectpdf,
  processpdf,
  downloadpdf,
  acceptProject,
  rejectproject,
  comment,
  like,
  showcomment,
  showlikes,
  deletecomment,
} = require("../Services/ProjectMangementServices");

const authService = require("../Services/authServices");

const router = express.Router();

router
  .route("/")
  .get(getallProject_warehouse)
  .post(
    authService.protect,
    authService.allowedto("admin", "student"),
    uploadprojectpdf,
    processpdf,
    createProject_warehouse
  );
router
  .route("/:id")
  .get(getProject_warehouse)
  .put(
    authService.protect,
    authService.allowedto("admin", "student"),
    uploadprojectpdf,
    processpdf,
    updateProject_warehouse
  )
  .delete(
    authService.protect,
    authService.allowedto("student"),
    deleteProject_warehouse
  );

router.route("/download/:filename").get(downloadpdf);
router.route("/accept/:projectid").put(acceptProject);
router.route("/reject/:projectid").delete(rejectproject);
router
  .route("/like")
  .post(authService.protect, authService.allowedto("student"), like);
router
  .route("/comments")
  .post(authService.protect, authService.allowedto("student"), comment);
router.route("/showLikes/:_id").get(showlikes);
router.route("/showComments/:_id").get(showcomment);

router.route("/deletecomment").delete(authService.protect, authService.allowedto("admin","student"),deletecomment)

module.exports = router;
