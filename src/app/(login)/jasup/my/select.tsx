import * as jose from "jose";
import moment from "moment";
import React, { AriaAttributes } from "react";

import { JasupData, JasupKoreanWhereArray, JasupWhere, WeekDayTime, getCurrentTime, koreanWhereTypeToEnglish } from "@/app/api/jasup/utils";
import { Outing } from "@/app/api/outing/utils";
import { TokenInfo, defaultUserData } from "@/app/auth/type";

const buttons = "text-base rounded h-10 border border-text/10 w-full max-w-36 max-[670px]:max-w-[32%] max-[480px]:max-w-[48%] max-[340px]:max-w-full px-8 transition-colors";

const Select = ({
  loading,
  etc, setEtc,
  where, setWhere,
  tmpOuting, setTmpOuting,
  onButtonClick,
  title = "자습 위치 설정하기",
  buttonText = "위치 설정하기",
}: {
  loading: boolean;
  etc: JasupData["etc"];
  setEtc: React.Dispatch<React.SetStateAction<JasupData["etc"]>>;
  where: JasupWhere;
  setWhere: React.Dispatch<React.SetStateAction<JasupWhere>>;
  tmpOuting: Outing;
  setTmpOuting: React.Dispatch<React.SetStateAction<Outing>>;
  onButtonClick?: () => any;
  title?: string;
  buttonText?: string;
}) => {
  const [userInfo, setUserInfo] = React.useState(defaultUserData);
  React.useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")!;
    const decrypt = jose.decodeJwt(accessToken) as TokenInfo;
    setUserInfo(decrypt.data);
  }, []);

  React.useEffect(() => {
    if(where === "outing")
      setEtc(`${tmpOuting.description}(${tmpOuting.start}~${tmpOuting.end})`);
  }, [tmpOuting.start, tmpOuting.end, tmpOuting.description]);

  React.useEffect(() => {
    if(where === "etcroom" || where === "outing" || where === "afterschool") return;
    if(where === "studyroom" && (etc === "물/화장실" || etc === "세탁")) return;
    setEtc("");
  }, [where]);

  return (
    <>
      <section className="flex flex-col gap-3">
        <section className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">{title}</h1>
        </section>
        <article className={[
          "flex flex-wrap flex-row gap-2 bg-white rounded border border-text/10 p-5 justify-center items-center",
          loading ? "loading_background" : "",
        ].join(" ")}>
          <button 
            onClick={() => {
              setWhere(userInfo.number > 3000 ? "studyroom" : "classroom");
              setEtc("물/화장실");
            }}
            className={[
              buttons,
              etc === "물/화장실" ? "bg-text/10" : "",
            ].join(" ")}
            disabled={loading}
          >
              물/화장실
          </button>
          <button 
            onClick={() => {
              setWhere(userInfo.number > 3000 ? "studyroom" : "classroom");
              setEtc("세탁");
            }}
            className={[
              buttons,
              etc === "세탁" ? "bg-text/10" : "",
            ].join(" ")}
            disabled={loading}
          >
              세탁
          </button>
          {
            JasupKoreanWhereArray.map((_, i) => (
              <button 
                key={i}
                onClick={() => {
                  setWhere(koreanWhereTypeToEnglish(_));
                  if(etc === "물/화장실" || etc === "세탁") setEtc("");
                }}
                className={[
                  buttons,
                  where === koreanWhereTypeToEnglish(_) && etc !== "물/화장실" && etc !== "세탁"
                    ? "bg-text/10" : "",
                ].join(" ")}
                disabled={loading}
              >
                {_}
              </button>
            ))
          }
        </article>
      </section>
      {
        where === "etcroom" ? (
          <section className="flex flex-col gap-1">
            <section className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold">자세한 위치 설정하기</h1>
            </section>
            <article className={[
              "flex flex-wrap flex-row gap-2 bg-white rounded border border-text/10 p-5 justify-center items-center",
              loading ? "loading_background" : "",
            ].join(" ")}>
              <input 
                type="text" 
                placeholder="현재 위치한 특별실 이름을 입력해주세요." 
                className="w-full h-10 border border-text/10 rounded px-3 bg-transparent"
                value={etc}
                onChange={(e) => setEtc(e.target.value)}
                disabled={loading}
              />
            </article>
          </section>
        ) : null
      }
      {
        where === "outing" ? (
          <section className="flex flex-col gap-1">
            <section className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold">외출 설정하기</h1>
            </section>
            <article className={[
              "flex flex-col gap-2 bg-white rounded border border-text/10 p-5",
              loading ? "loading_background" : "",
            ].join(" ")}>
              <section className="flex flex-row justify-center items-center w-full gap-2">
                <input 
                  type="text" 
                  placeholder="외출 사유를 입력해주세요."
                  className="bg-transparent rounded border border-text/10 px-4 py-2 text-base w-full"
                  value={tmpOuting.description}
                  onChange={e => setTmpOuting(p => ({ ...p, description: e.target.value }))}
                />
              </section>
              <section className="flex flex-row justify-center items-center w-full gap-2">
                <input 
                  type="time"
                  className="bg-transparent rounded border border-text/10 px-4 py-2 text-base w-full text-center"
                  value={tmpOuting.start}
                  onChange={e => setTmpOuting(p => ({ ...p, 
                    start: moment(e.target.value, "HH:mm").format("HH:mm")
                  }))}
                />
                <p>~</p>
                <input 
                  type="time" 
                  className="bg-transparent rounded border border-text/10 px-4 py-2 text-base w-full text-center"
                  value={tmpOuting.end}
                  onChange={e => setTmpOuting(p => ({ ...p, 
                    end: moment(e.target.value, "HH:mm").format("HH:mm")
                  }))}
                />
              </section>
            </article>
          </section>
        ) : null
      }
      {
        where === "afterschool" ? (
          <section className="flex flex-col gap-1">
            <section className="flex flex-col gap-1">
              <h1 className="text-xl font-semibold">방과후 설정하기</h1>
            </section>
            <article className={[
              "flex flex-wrap flex-row gap-2 bg-white rounded border border-text/10 p-5 justify-center items-center",
              loading ? "loading_background" : "",
            ].join(" ")}>
              <input 
                type="text" 
                placeholder="현재 방과후 과목명을 입력해주세요." 
                className="w-full h-10 border border-text/10 rounded px-3 bg-transparent"
                value={etc}
                onChange={(e) => setEtc(e.target.value)}
                disabled={loading}
              />
            </article>
          </section>
        ) : null
      }
      <button 
        className="bg-primary text-white w-full text-base font-semibold rounded h-10"
        onClick={onButtonClick}
        disabled={loading}
      >
        {buttonText}
      </button>
    </>
  );
};

export default Select;