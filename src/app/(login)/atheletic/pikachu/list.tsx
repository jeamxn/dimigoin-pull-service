import React from "react";

import { alert } from "@/utils/alert";
import instance from "@/utils/instance";

const List = () => {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<{
    id: string;
    time: string;
    player: string;
  }[]>([]);

  const getList = async () => {
    setLoading(true);
    try {
      const { data } = await instance.get("/api/pikachu");
      console.log(data);
      setData(data.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    getList();
  }, []);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-row items-center">
        <h1 className="text-xl font-semibold">방 개설 목록</h1>
        <div className={[
          "hover:font-semibold cursor-pointer transition-all h-7 w-7 flex items-center justify-center",
          loading ? "rotation" : "",
        ].join(" ")} onClick={getList}>
          <svg width="14" height="14" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.69922 16.8835C6.46589 16.8835 4.57422 16.1085 3.02422 14.5585C1.47422 13.0085 0.699219 11.1169 0.699219 8.88354C0.699219 6.65021 1.47422 4.75855 3.02422 3.20854C4.57422 1.65854 6.46589 0.883545 8.69922 0.883545C9.84922 0.883545 10.9492 1.12104 11.9992 1.59604C13.0492 2.07104 13.9492 2.75021 14.6992 3.63354V1.88354C14.6992 1.60021 14.7951 1.36271 14.9867 1.17104C15.1784 0.979378 15.4159 0.883545 15.6992 0.883545C15.9826 0.883545 16.2201 0.979378 16.4117 1.17104C16.6034 1.36271 16.6992 1.60021 16.6992 1.88354V6.88354C16.6992 7.16688 16.6034 7.40438 16.4117 7.59605C16.2201 7.78771 15.9826 7.88354 15.6992 7.88354H10.6992C10.4159 7.88354 10.1784 7.78771 9.98672 7.59605C9.79505 7.40438 9.69922 7.16688 9.69922 6.88354C9.69922 6.60021 9.79505 6.36271 9.98672 6.17104C10.1784 5.97938 10.4159 5.88354 10.6992 5.88354H13.8992C13.3659 4.95021 12.6367 4.21688 11.7117 3.68354C10.7867 3.15021 9.78255 2.88354 8.69922 2.88354C7.03255 2.88354 5.61589 3.46688 4.44922 4.63354C3.28255 5.80021 2.69922 7.21688 2.69922 8.88354C2.69922 10.5502 3.28255 11.9669 4.44922 13.1335C5.61589 14.3002 7.03255 14.8835 8.69922 14.8835C9.83255 14.8835 10.8701 14.596 11.8117 14.021C12.7534 13.446 13.4826 12.6752 13.9992 11.7085C14.1326 11.4752 14.3201 11.3127 14.5617 11.221C14.8034 11.1294 15.0492 11.1252 15.2992 11.2085C15.5659 11.2919 15.7576 11.4669 15.8742 11.7335C15.9909 12.0002 15.9826 12.2502 15.8492 12.4835C15.1659 13.8169 14.1909 14.8835 12.9242 15.6835C11.6576 16.4835 10.2492 16.8835 8.69922 16.8835Z" fill="rgb(var(--color-primary) / 1)"/>
          </svg>
        </div>
      </div>
      <section className="flex flex-wrap gap-4 flex-row items-center justify-center">
        <section className={[
          "flex flex-col gap-4 bg-white rounded border border-text/10 p-5 overflow-auto w-full",
          loading ? "loading_background" : "",
        ].join(" ")}>
          <table className="w-full overflow-auto">
            <tbody className="w-full border-y border-text/10 overflow-auto">
              <tr className="w-full">
                <th className="text-center px-4 whitespace-nowrap py-2 font-semibold w-full" colSpan={4}>개설 방 현황</th>
              </tr>
              {
                data.length ? data.map((room, index) => {
                  const copyToClipboard = (text: string) => {
                    const textarea = document.createElement("textarea");
                    textarea.value = text;
                    textarea.style.position = "fixed"; // 화면에서 보이지 않도록 고정합니다.
                    document.body.appendChild(textarea);
                    textarea.select(); // 텍스트를 선택합니다.
                    try {
                      document.execCommand("copy");
                      alert.success("클립보드에 복사되었습니다.");
                    } catch (err) {
                      console.error("클립보드 복사 오류:", err);
                      alert.error("클립보드 복사에 실패했습니다.");
                    }
                    document.body.removeChild(textarea);
                  };
                  const idString = `${room.id.slice(0, 5)}-${room.id.slice(5, 10)}-${room.id.slice(10, 15)}-${room.id.slice(15, 20)}`;
                  return (
                    <tr 
                      className={[
                        "w-full border-y border-text/10",
                      ].join(" ")}
                      key={index}
                    >
                      <td className="text-center px-4 whitespace-nowrap py-2 font-semibold text-inherit">
                        {room.time}
                      </td>
                      <td className="px-4 select-none text-left text-inherit border-l border-text/10">
                        {room.player}
                      </td>
                      <td className="w-full text-left px-4 text-inherit border-x border-text/10">
                        {idString}
                      </td>
                      <td 
                        className="text-center px-4 whitespace-nowrap text-inherit cursor-pointer select-none"
                        onClick={() => copyToClipboard(idString)}
                      >
                    복사
                      </td>
                    </tr>
                  );
                }) : (
                  <tr className="w-full border-y border-text/10">
                    <td className="text-center px-4 whitespace-nowrap py-2 text-text/50" colSpan={4}>개설된 방이 없습니다.</td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </section>
      </section>
    </section>
  );
};

export default List;