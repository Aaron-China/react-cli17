import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { RightOutlined, DownOutlined } from "@ant-design/icons";
import "./index.less";

// 一个左侧主菜单组件
const CMenu = ({ 
  width = "220px",  // 宽度
  active,           // 当前激活的菜单name
  actives,          // 当前激活的菜单链 例: main-user-add
  list = [],        // 菜单列表
  change            // 底层菜单变化的回调
}) => {
  const navigate = useNavigate();
  let [spread, setSpread] = useState(false),
    [activeKey, setActiveKey] = useState(""),
    [activeKeys, setActiveKeys] = useState("");

  useEffect(() => {
    setActiveKey(active);
    setActiveKeys(actives);
  }, [active, actives]);

  // 菜单点击
  const handleClick = (e, idx, d) => {
    e.stopPropagation();
    let arr = activeKeys.split("-");
    let flag = arr.some((item) => item === d.name);
    // 已存在
    if (flag) {
      if (idx === 0) {
        arr = [];
      } else if (idx === 1) {
        arr[1] = "";
        arr[2] = "";
      }
    } else {
      arr[idx] = d.name;
    }
    setActiveKeys(arr.join("-"));
    // 没有子菜单，需跳转页面
    if (!(d.children && d.children.length)) {
      setActiveKey(d.name);
      navigate(d.path);
      if (change) change(d);
    }
  };
  // 判断菜单是否需要展示子菜单
  const renderIcon = (d) => {
    if (d.children && d.children.length) {
      if (activeKeys.indexOf(d.name) >= 0) {
        return <DownOutlined className="open" />;
      } else {
        return <RightOutlined className="open" />;
      }
    } else {
      return "";
    }
  };

  return (
    <div
      className="c-menu"
      style={{
        width: !spread ? width : "0px",
        minWidth: !spread ? width : "0px",
      }}
    >
      <div className="header">XXS</div>
      <div
        className={`tool ${spread && "toolActive"}`}
        onClick={() => setSpread(!spread)}
      >
        <div></div>
        <div></div>
        <div></div>
        {spread ? <div className="right"></div> : <div className="left"></div>}
      </div>
      <div className="contain">
        {
          /* 一级菜单 */
          list.map((m1) => {
            return (
              <div className="m1" key={m1.name}>
                <div onClick={(e) => handleClick(e, 0, m1)}>
                  <div
                    className={`row row1 ${
                      activeKeys.indexOf(m1.name) >= 0 && "actLine"
                    } ${activeKey === m1.name && "active"}`}
                  >
                    {m1.title}
                    {renderIcon(m1)}
                  </div>
                  <div
                    className={`item ${
                      m1.children &&
                      m1.children.length &&
                      activeKeys.indexOf(m1.name) >= 0 &&
                      "active"
                    }`}
                  >
                    {
                      /* 二级菜单 */
                      (m1.children || []).map((m2) => {
                        return (
                          <div className="m2" key={m2.name}>
                            <div onClick={(e) => handleClick(e, 1, m2)}>
                              <div
                                className={`row row2 ${
                                  m2.name === activeKey && "active"
                                }`}
                              >
                                {m2.title}
                                {renderIcon(m2)}
                              </div>
                              <div
                                className={`item ${
                                  m2.children &&
                                  m2.children.length &&
                                  activeKeys.indexOf(m2.name) >= 0 &&
                                  "active"
                                }`}
                              >
                                {
                                  /* 三级菜单 */
                                  (m2.children || []).map((m3) => {
                                    return (
                                      <div className="m3" key={m3.name}>
                                        <div
                                          onClick={(e) => handleClick(e, 2, m3)}
                                        >
                                          <div
                                            className={`row row3 ${
                                              m3.name === activeKey && "active"
                                            }`}
                                          >
                                            {m3.title}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                }
                              </div>
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};

CMenu.propTypes = {
  width: PropTypes.string,
  active: PropTypes.string,
  actives: PropTypes.string,
  list: PropTypes.array,
  change: PropTypes.func,
};

export default CMenu;
