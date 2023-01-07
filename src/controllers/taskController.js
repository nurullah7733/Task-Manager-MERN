const tasksModel = require("../models/taskModel");

exports.createTask = (req, res) => {
  let reqBody = req.body;
  reqBody.email = req.headers.email;
  tasksModel.create(reqBody, (e, data) => {
    if (e) {
      res.status(400).json({ status: "fail", data: e });
    } else {
      res.status(200).json({ status: "success", data: data });
    }
  });
};

exports.deleteTask = (req, res) => {
  let id = req.params.id;
  tasksModel.remove({ _id: id }, (e, data) => {
    if (e) {
      res.status(400).json({ status: "fail", data: e });
    } else {
      res.status(200).json({ status: "success", data: data });
    }
  });
};

exports.updateTaskStatus = (req, res) => {
  let id = req.params.id;
  let status = req.params.status;
  tasksModel.updateOne({ _id: id }, { status: status }, (e, data) => {
    if (e) {
      res.status(400).json({ status: "fail", data: e });
    } else {
      res.status(200).json({ status: "success", data: data });
    }
  });
};

exports.getTaskByStatus = (req, res) => {
  let status = req.params.status;
  let email = req.headers.email;
  tasksModel.aggregate(
    [
      { $match: { status: status, email: email } },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createdDate: {
            $dateToString: { date: "$createdDate", format: "%d-%m-%Y" },
          },
        },
      },
    ],
    (e, data) => {
      if (e) {
        res.status(400).json({ status: "fail", data: e });
      } else {
        res.status(200).json({ status: "success", data: data });
      }
    }
  );
};

// Task Summary
exports.taskSummary = (req, res) => {
  let email = req.headers["email"];
  tasksModel.aggregate(
    [
      { $match: { email: email } },
      { $group: { _id: "$status", sum: { $count: {} } } },
    ],
    (err, data) => {
      if (err) {
        res.status(400).json({ status: "fail", data: err });
      } else {
        res.status(200).json({ status: "success", data: data });
      }
    }
  );
};
