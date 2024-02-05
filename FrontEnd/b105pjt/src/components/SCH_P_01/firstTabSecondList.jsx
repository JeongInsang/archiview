import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { Box } from "@mui/material";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function ChipsArray({
  tagDataList,
  bigTagData,
  setTagDataList,
  smallTagData,
  smallTagList,
  setSmallTagData,
  pickTagList,
  setPickTagList,
  setChecked,
  checked,
}) {
  function checkTagData(content) {
    if (
      pickTagList
        .filter((item) => item.bigTag === bigTagData)
        .filter((item) => item.key === "ALL").length === 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  function changeTagData(indexList, contentList) {
    setTagDataList([
      ...tagDataList.filter((item) => item.bigTag !== bigTagData),
      {
        bigTag: bigTagData,
        smallTagIndex: indexList,
        tab: "csList",
        smallTag: contentList,
      },
    ]);
  }

  function changePickTagData(content) {
    setPickTagList([
      ...pickTagList.filter((item) => item.bigTag !== bigTagData),
      {
        smallTag: content.smallTag,
        bigTag: bigTagData,
        key: content.key,
      },
    ]);
  }

  function plusPickTagData(content) {
    if (smallTagData.length === smallTagList.length - 1) {
      changePickTagData({ smallTag: "전체", key: "ALL" });
    } else {
      setPickTagList([
        ...pickTagList,
        {
          smallTag: content.smallTag,
          bigTag: bigTagData,
          key: content.key,
          small: content.smallTag,
        },
      ]);
    }
  }

  function delPickTagData(content) {
    setPickTagList([
      ...pickTagList.filter(
        (item) => item.bigTag !== bigTagData || item.key !== content.key
      ),
    ]);
  }

  const AllClick = () => {
    setSmallTagData([...smallTagList.keys()]);
    changeTagData(
      [...smallTagList.keys()],
      [...smallTagList].map((item) => item.smallTag)
    );
    if (checkTagData("ALL")) {
      changePickTagData({ smallTag: "전체", key: "ALL" });
    }
  };

  const handleClick = (data) => {
    // if (!checked.includes(data.bigTag)) {
    //   setChecked([...checked, data.bigTag]);
    // }
    setSmallTagData((prevSelectedChips) => {
      if (smallTagData.length === smallTagList.length) {
        changeTagData([data.key], [data.smallTag]);
        changePickTagData(data);
        return [data.key];
      } else {
        if (prevSelectedChips.includes(data.key)) {
          if (smallTagData.length !== 1) {
            changeTagData(
              prevSelectedChips.filter((chipKey) => chipKey !== data.key),
              tagDataList
                .filter((item) => item.bigTag === bigTagData)[0]
                .smallTag.filter((item) => item !== data.smallTag)
            );
            delPickTagData(data);
            return prevSelectedChips.filter((chipKey) => chipKey !== data.key);
          } else {
            return [...prevSelectedChips];
          }
        } else {
          changeTagData(
            [...prevSelectedChips, data.key],
            [
              ...tagDataList.filter((item) => item.bigTag === bigTagData)[0]
                .smallTag,
              data.smallTag,
            ]
          );
          plusPickTagData(data);
          return [...prevSelectedChips, data.key];
        }
      }
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0.5,
        m: 0,
      }}
      component="ul"
    >
      {bigTagData !== "" ? (
        <ListItem key="All">
          <Chip
            label="All"
            variant="outlined"
            onClick={() => AllClick()}
            color={
              smallTagData.length === smallTagList.length
                ? "primary"
                : "default"
            }
          />
        </ListItem>
      ) : null}
      {smallTagList.map((data) => {
        const isSelected = smallTagData.includes(data.key);

        return (
          <ListItem key={data.key}>
            <Chip
              label={data.smallTag}
              onClick={() => handleClick(data)}
              variant="outlined"
              color={
                smallTagData.length !== smallTagList.length &&
                smallTagData.includes(data.key)
                  ? "primary"
                  : "default"
              }
              sx={{
                color: isSelected ? "primary" : "default",
              }}
            />
          </ListItem>
        );
      })}
    </Box>
  );
}
