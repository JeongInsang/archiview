import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import AutoCompleteCompo from "./autoCompleteCompo";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Unstable_Grid2";
import FirstTabFirstList from "./firstTabFirstList";
import FirstTabSecondList from "./firstTabSecondList";
import SecondTabFirstList from "./secondTabFirstList";
import SecondTabSecondList from "./secondTabSecondList";
import TagListCompo from "./tagListCompo";
import { Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SearchIcon from "@mui/icons-material/Search";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { questionSearch } from "../../api/questionAPI";
import { getJobPostingDetail } from "../../api/commonsAPI";
import { useDispatch, useSelector } from "react-redux";
import { updateCompany } from "../../store/slice/replySlice";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ ...other }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TabCompo({
  setQuestions,
  setCsList,
  setJobList,
  userId,
  inView,
  questions,
}) {
  const dispatch = useDispatch();
  const [dumyData, setDumyData] = useState({
    csList: [{ name: "", csSubList: "" }],
    jsList: [{ name: "", jobSubList: "" }],
  });
  const [value, setValue] = useState(0);
  const [tagDataList, setTagDataList] = useState([]);
  const [checked, setChecked] = useState([]);
  const [bigTagList, setBigTagList] = useState([]);
  const [bigTagData, setBigTagData] = useState("");
  const [smallTagData, setSmallTagData] = useState([]);
  const [smallTagList, setSmallTagList] = useState([]);
  const [pickTagList, setPickTagList] = useState([]);
  const [tagSearchOpen, setTagSearchOpen] = useState(false);
  const [pgno, setPgno] = useState(1);
  const [tabCsList, setTabCsList] = useState([]);
  const [tabJobList, setTabJobList] = useState([]);
  const [isClick, setisClick] = useState(false);
  const { selectedCompany } = useSelector((state) => state.reply);

  useEffect(() => {
    if (setCsList && setJobList) {
      setCsList(
        tagDataList
          .filter((item) => item.tab === "csList")
          .map((item) => item.smallTag)
          .flat()
      );
      setJobList(
        tagDataList
          .filter((item) => item.tab === "jsList")
          .map((item) => item.smallTag)
          .flat()
      );
    }
  }, [tagDataList]);

  useEffect(() => {
    setisClick(false);
    setPgno(1);
  }, [tagDataList, selectedCompany]);

  useEffect(() => {
    const csList = dumyData.csList.map(function (ojt) {
      const rOjt = ojt.name;
      return rOjt;
    });
    const jobList = dumyData.jsList.map(function (ojt) {
      const rOjt = ojt.name;
      return rOjt;
    });
    setTabCsList(csList);
    setTabJobList(jobList);
    setBigTagList(csList);
  }, [dumyData]);

  useEffect(() => {
    const getJobDetail = async () => {
      await getJobPostingDetail((res) => {
        setDumyData(res.data.data);
      });
    };
    if (userId) {
      setisClick(true);
    }
    getJobDetail();
  }, []);

  // 무한 스크롤
  useEffect(() => {
    if (inView && isClick) {
      onClickSearch();
    }
  }, [inView]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleReset = () => {
    setSmallTagData([]);
    setSmallTagList([]);
    setBigTagData("");
    setTagDataList([]);
    setChecked([]);
    setPickTagList([]);
    setQuestions([]);
    dispatch(
      updateCompany({
        selectedCompany: {
          id: "",
          name: "",
        },
      })
    );
  };

  const handleOpenSearchBar = () => {
    setTagSearchOpen(false);
  };

  const handleCloseSearchBar = () => {
    setTagSearchOpen(true);
  };

  const onClickTab = (value, tabData) => {
    setBigTagData("");
    setBigTagList(value);
    setSmallTagList([]);
    setSmallTagData([]);
  };

  const onClickSearch = async () => {
    const data = {
      userId: userId,
      company: selectedCompany.name,
      cs: tagDataList
        .filter((item) => item.tab === "csList")
        .map((item) => item.smallTag)
        .flat()
        .join(),
      job: tagDataList
        .filter((item) => item.tab === "jsList")
        .map((item) => item.smallTag)
        .flat()
        .join(),
      pgno: pgno,
    };
    await questionSearch(data).then((res) => {
      if (res.data.data) {
        if (!isClick) {
          updateSearch(res.data.data);
          setisClick(true);
        } else {
          updateSearch([...questions, ...res.data.data]);
        }
      } else {
        if (!isClick) {
          updateSearch([]);
        }
      }
    });
  };

  const updateSearch = async (updateQuestions) => {
    setQuestions(updateQuestions);
    setPgno((page) => page + 1);
  };

  return (
    <Box
      sx={{
        width: "100%",
        border: "2px solid #1769aa",
        marginTop: "10px",
        borderRadius: "10px",
        marginBottom: "20px",
      }}
    >
      {/* SELECT1, SELECT2 nav Box */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          padding: "5px",
          paddingBottom: "0",
        }}
      >
        <Tabs value={value} onChange={handleChange} aria-label="기본 탭 예제">
          <Tab
            label="면접 유형"
            {...a11yProps(0)}
            onClick={() => onClickTab(tabCsList, "csList")}
            sx={{ padding: "5px 10px" }} // 탭의 패딩 감소
          />
          <Tab
            label="희망 직무"
            {...a11yProps(1)}
            onClick={() => onClickTab(tabJobList, "jobList")}
            sx={{ padding: "5px 10px" }} // 탭의 패딩 감소
          />
        </Tabs>
      </Box>

      {/* 회사명(자동완성 기능) */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 10px",
        }}
      >
        <AutoCompleteCompo />
        <div>
          {tagSearchOpen ? (
            <Button
              onClick={handleOpenSearchBar}
              startIcon={<ExpandMoreIcon />}
            ></Button>
          ) : (
            <Button
              onClick={handleCloseSearchBar}
              startIcon={<ExpandLessIcon />}
            ></Button>
          )}
        </div>
      </div>
      <Divider />

      {!tagSearchOpen && (
        <div>
          {/* SELECT1 패널 */}
          {/* 대분류, 소분류까지 */}
          <CustomTabPanel value={value} index={0} padding="0px">
            <Grid container>
              {/* 대분류 */}
              <Grid
                xs={6}
                sx={{ borderRight: "0.8px solid rgba(0, 0, 0, 0.12)" }}
              >
                <FirstTabFirstList
                  tagDataList={tagDataList}
                  setTagDataList={setTagDataList}
                  bigTagData={bigTagData}
                  setBigTagData={setBigTagData}
                  checked={checked}
                  setChecked={setChecked}
                  smallTagData={smallTagData}
                  setSmallTagData={setSmallTagData}
                  bigTagList={bigTagList}
                  setBigTagList={setBigTagList}
                  smallTagList={smallTagList}
                  setSmallTagList={setSmallTagList}
                  pickTagList={pickTagList}
                  setPickTagList={setPickTagList}
                  dumyData={dumyData.csList}
                />
              </Grid>

              {/* 소분류 */}
              <Grid xs={6}>
                <FirstTabSecondList
                  tagDataList={tagDataList}
                  setTagDataList={setTagDataList}
                  bigTagData={bigTagData}
                  smallTagData={smallTagData}
                  setSmallTagData={setSmallTagData}
                  smallTagList={smallTagList}
                  pickTagList={pickTagList}
                  setPickTagList={setPickTagList}
                />
              </Grid>
            </Grid>
            <Divider />
          </CustomTabPanel>
          {/* SELECT2 패널 */}
          {/* 대분류, 소분류까지 */}
          <CustomTabPanel value={value} index={1}>
            <Grid container>
              {/* 대분류 */}
              <Grid
                xs={6}
                sx={{ borderRight: "0.8px solid rgba(0, 0, 0, 0.12)" }}
              >
                <SecondTabFirstList
                  tagDataList={tagDataList}
                  setTagDataList={setTagDataList}
                  bigTagData={bigTagData}
                  setBigTagData={setBigTagData}
                  checked={checked}
                  setChecked={setChecked}
                  smallTagData={smallTagData}
                  setSmallTagData={setSmallTagData}
                  bigTagList={bigTagList}
                  setBigTagList={setBigTagList}
                  smallTagList={smallTagList}
                  setSmallTagList={setSmallTagList}
                  pickTagList={pickTagList}
                  setPickTagList={setPickTagList}
                  dumyData={dumyData.jsList}
                />
              </Grid>

              {/* 소분류 */}
              <Grid xs={6}>
                <SecondTabSecondList
                  tagDataList={tagDataList}
                  setTagDataList={setTagDataList}
                  bigTagData={bigTagData}
                  smallTagData={smallTagData}
                  setSmallTagData={setSmallTagData}
                  smallTagList={smallTagList}
                  pickTagList={pickTagList}
                  setPickTagList={setPickTagList}
                />
              </Grid>
            </Grid>
          </CustomTabPanel>
        </div>
      )}

      <Divider />

      {/* 태그 모음 */}
      <Box>
        <TagListCompo
          pickTagList={pickTagList}
          setPickTagList={setPickTagList}
          smallTagData={smallTagData}
          setSmallTagData={setSmallTagData}
          tagDataList={tagDataList}
          setTagDataList={setTagDataList}
          bigTagData={bigTagData}
          checked={checked}
          setChecked={setChecked}
        />
      </Box>

      {/* 검색 버튼 */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", // 오른쪽 정렬
          alignItems: "center",
          marginTop: "5px",
          marginBottom: "5px",
        }}
      >
        <Button
          onClick={() => handleReset()}
          startIcon={<RestartAltIcon />}
        ></Button>
        {!setCsList && (
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={onClickSearch}
          ></Button>
        )}
      </Box>
    </Box>
  );
}
