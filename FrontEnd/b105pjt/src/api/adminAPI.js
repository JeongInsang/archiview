import { baseAxios } from "../utils/httpCommons";

const baseURL = baseAxios();

async function getUserList(token, success, fail) {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  await baseURL.get(`admin/users`, config).then(success).catch(fail);
}

async function setUserBlock(param, token, success, fail) {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  await baseURL
    .patch(`admin/users/block?userId=${param}`, null, config)
    .then(success)
    .catch(fail);
}

async function setUserUp(param, token, success, fail) {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  await baseURL
    .patch(`admin/users/upgrade?userId=${param.id}`, null, config)
    .then(success)
    .catch(fail);
}

async function setUserDown(param, token, success, fail) {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  await baseURL
    .patch(`admin/users/downgrade?userId=${param}`, null, config)
    .then(success)
    .catch(fail);
}

function deleteReplyByAdmin(param, token, success, fail) {
  const config = {
    headers: {
      Authorization: token,
    },
  };

  return baseURL
    .delete(`admin/replies/${param}`, config)
    .then(success)
    .catch(fail);
}

export {
  getUserList,
  setUserBlock,
  setUserDown,
  setUserUp,
  deleteReplyByAdmin,
};
