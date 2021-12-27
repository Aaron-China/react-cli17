import React, { useState, useEffect } from "react";
import * as Highcharts from '@jsModule/highcharts/highcharts-gantt.js'
import { getList, saveD } from "@api/report";
import dayjs from 'dayjs'
import{ WEEKS } from './constants'

const data = [
  {start: '2021-6-1 0',end: '2021-6-1 18',factory: '华为',material: 'P50', uid: 1, y: 0, completed: 0.35}, 
  {start: '2021-6-2 8',end: '2021-6-2 16',factory: '华为',material: 'P50', uid: 2, y: 0}, 
  {start: '2021-6-3 8',end: '2021-6-4 24',factory: '华为',material: 'P50', uid: 3, y: 0}, 
  {start: '2021-6-4 12',end: '2021-6-5 15',factory: '华为',material: 'P50', uid: 4, y: 0}, 

  {start: '2021-6-1 8',end: '2021-6-1 12',factory: '小米',material: '红米3', uid: 5, y: 1}, 
  {start: '2021-6-3 3',end: '2021-6-3 9',factory: '小米',material: '红米3', uid: 6, y: 1}, 

  {start: '2021-6-1 6',end: '2021-6-1 16',factory: '苹果',material: 'iPhone13', uid: 7, y: 2}, 
  {start: '2021-6-2 3',end: '2021-6-2 19',factory: '苹果',material: 'iPhone13', uid: 8, y: 2}, 
  {start: '2021-6-3 8',end: '2021-6-3 17',factory: '苹果',material: 'iPhone13', uid: 9, y: 2}, 

  {start: '2021-6-1 12',end: '2021-6-1 24',factory: 'OPPO',material: 'Reno7', uid: 10, y: 3},
  {start: '2021-6-2 5',end: '2021-6-2 18',factory: 'OPPO',material: 'Reno7', uid: 11, y: 3},
  {start: '2021-6-3 1',end: '2021-6-5 12',factory: 'OPPO',material: 'Reno7', uid: 12, y: 3},
];
let newData = data.map(item => {
  item.start = dayjs(item.start).valueOf();
  item.end = dayjs(item.end).valueOf();
  return item
});
Highcharts.setOptions({
  global: {
    useUTC: false  // 不使用utc时间
  },
  lang: {
    noData: '暂无数据',
    weekdays: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    months: ['一月', '儿月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
  },
});
let gantt = {};

// 具体代码注释，组件的使用详情，去这，有详细说明  https://www.cnblogs.com/pengfei-nie/p/15608101.html
function Gantt() {
  useEffect(() => {
    init();
  }, []);

  const init = () => {
    try {
      gantt = Highcharts.ganttChart('container', {
        title: {
          text: '甘特图示例'
        },
        xAxis: [{
          currentDateIndicator: true,
          tickPixelInterval: 70,
          grid: {
            borderWidth: 1, // 右侧表头边框宽度
            cellHeight: 35, // 右侧日期表头高度
          },
          labels: {
            align: 'center',
            formatter: function() {
              return `${dayjs(this.value).format('M月D')}  ${WEEKS[dayjs(this.value).day()]}`;
            }
          },
        }, {
          labels: {
            align: 'center',
            formatter: function() {
              return `${dayjs(this.value).format('YYYY年M月')}`;
            }
          },
        }],
        yAxis: {
          type: 'category',
          grid: {
            enabled: true,
            borderColor: 'rgba(0,0,0,0.3)',
            borderWidth: 1,
            columns: [
              { title: { text: '工厂' }, labels: { format: '{point.factory}' } }, 
              { title: { text: '型号' }, labels: { format: '{point.material}' } }, 
            ]
          }
        },
        tooltip: {
          formatter: function () {
            return `<div>
             工厂: ${this.point.factory}<br/>
            开始时间: ${dayjs(this.point.start).format('YYYY-MM-DD HH:mm:ss')}<br/>
            结束时间: ${dayjs(this.point.end).format('YYYY-MM-DD HH:mm:ss')}<br/>
            </div>`
          }
        },
        series: [{ data: newData }],
        plotOptions: {
          series: {
            animation: false,     // Do not animate dependency connectors
            dragDrop: {
              draggableX: true,   // 横向拖拽
              draggableY: true,   // 纵向拖拽
              dragMinY: 0,        // 纵向拖拽下限
              dragMaxY: 3,        // 纵向拖拽上限
              dragPrecisionX: 3600000   // 横向拖拽精度，单位毫秒
            },
            dataLabels: {
              enabled: true,
              format: '{point.factory}-{point.uid}',
              style: {
                cursor: 'default',
                pointerEvents: 'none'
              }
            },
            allowPointSelect: true,
            point: {
              events: {
                dragStart: dragStart,
                drag: drag,
                drop: drop,
                select: handleSelect
              }
            }
          }
        },
        exporting: {
          sourceWidth: 1000
        },
        credits: {    // 去掉右下角版权信息
          enabled: false
        },
      });
    } catch (error) {
      console.log(error)
    }
  };
  const dragStart = (e) => {
  };
  const drag = (e) => {
  };
  const drop = (e) => {
    const { newPoint = {}, target = {} } = e;
    if(newPoint.y || newPoint.y === 0) {
      let list = [], tar = newData.find(item => item.y === newPoint.y && item.uid !== target.uid);
      list = newData.map(item => {
        // 当前拖拽数据
        if(item.uid === target.uid) {
          return {
            ...item,
            factory: tar.factory,
            material: tar.material, 
            ...newPoint
          }
        } else {
          return item
        }
      })
      gantt.update({
        series: [{
          data: list
        }]
      })
    }
  };
  const handleSelect = (e) => {
    console.log('编辑')
  };
  const getData = () => {
    let data = gantt.series[0].data.map(item => {
      return {
        uid: item.uid,
        factory: item.factory,
        material: item.material,
        start: item.start,
        end: item.end
      }
    })
    console.log(data)
  };

  return (
    <div className="hightChart-gantt">
      <div id="container"></div>
      <button onClick={getData}>打印当前数据</button>
    </div>
  );
}

export default Gantt;
