import landscade from "../assets/page1-icons/landscape.png";
import handshake from "../assets/page1-icons/handshake.png";
import cloudy from "../assets/page1-icons/cloudy.png";
import pawPrint from "../assets/page1-icons/paw-print.png";
import chart from "../assets/page1-icons/chart.png";

export const banner = [
  {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/cTyLQiaRrpzxFAuWwoDQ.svg',
    imgMobile: 'https://gw.alipayobjects.com/zos/rmsportal/ksMYqrCyhwQNdBKReFIU.svg',
    className: 'seeconf-wrap',  
    children: [
      { children: 'Detroit for Your Sustainable Loan', className: 'seeconf-en-name' },
      { children: 'Category Based Loans for You', className: 'seeconf-title', tag: 'h1' },
      { children: 'Explore Different Types of Loans and Choose the Most Suitable One for You', className: 'seeconf-cn-name' },
      {
        children: 'Learn More',
        className: 'banner-button',
        tag: 'button',
        link: '#',
      },
      { children: 'Detroit - Ensure a Sustainable Future for Earth', className: 'seeconf-time' },
    ],
  },
  {
    img: 'https://gw.alipayobjects.com/zos/rmsportal/cTyLQiaRrpzxFAuWwoDQ.svg',
    imgMobile: 'https://gw.alipayobjects.com/zos/rmsportal/ksMYqrCyhwQNdBKReFIU.svg',
    className: 'seeconf-wrap',
    children: [
      { children: 'Detroit for Your Sustainable Loan', className: 'seeconf-en-name' },
      { children: 'Easy Loan Assesment', className: 'seeconf-title', tag: 'h1' },
      { children: 'Get Your Loan Application Easy and Fast', className: 'seeconf-cn-name' },
      {
        children: 'Learn More',
        className: 'banner-button',
        tag: 'button',
        link: '#',
      },
      { children: 'Detroit - Ensure a Sustainable Future for Earth', className: 'seeconf-time' },
    ],
  },
];

export const page1 = {
  title: 'Loan Categories',
  children: [
    {
      title: 'Green Loans',
      content: 'Renewable energy, green buildings, energy efficiency, clean transportation.',
      src: landscade,
      color: '#52C41A',
      shadowColor: 'rgba(166, 55, 112, 0.08)',
      link: '#',
    },
    {
      title: 'Social Loans',
      content: 'Affordable housing, education, healthcare, financial inclusion.',
      src: handshake,
      color: '#ED5575', 
      shadowColor: 'rgba(15, 93, 166, 0.08)',
      link: '#',
    },
    {
      title: 'Sustainability-Linked Loans (SLLs)',
      content: 'Emissions reduction targets, water usage efficiency, diversity goals.',
      src: chart,
      color: '#722ED1',
      shadowColor: 'rgba(112, 73, 166, 0.08)',
      link: '#',
    },
    {
      title: 'Climate Adaptation Loans',
      content: 'Flood defenses, drought-resistant agriculture.',
      src: cloudy,
      color: '#237804',
      shadowColor: 'rgba(166, 55, 112, 0.08)',
      link: '#',
    },
    {
      title: 'Biodiversity & Conservation Loans',
      content: 'Reforestation, marine protection, wildlife conservation.',
      src: pawPrint,
      color: '#FA8C16',
      shadowColor: 'rgba(166, 55, 112, 0.08)',
      link: '#',
    }
  ],
};

export const page3 = {
  title: 'Popular Products',
  children: [
    {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/iVOzVyhyQkQDhRsuyBXC.svg',
      imgMobile: 'https://gw.alipayobjects.com/zos/rmsportal/HxEfljPlykWElfhidpxR.svg',
      src: 'https://gw.alipayobjects.com/os/rmsportal/gCFHQneMNZMMYEdlHxqK.mp4',
    },
    {
      img: 'https://gw.alipayobjects.com/zos/rmsportal/iVOzVyhyQkQDhRsuyBXC.svg',
      imgMobile: 'https://gw.alipayobjects.com/zos/rmsportal/HxEfljPlykWElfhidpxR.svg',
      src: 'https://gw.alipayobjects.com/os/rmsportal/gCFHQneMNZMMYEdlHxqK.mp4',
    },
  ],
};

export const page4 = {
  title: 'Used by Many Enterprises',
  children: [
    'https://gw.alipayobjects.com/zos/rmsportal/qImQXNUdQgqAKpPgzxyK.svg', // Alibaba
    'https://gw.alipayobjects.com/zos/rmsportal/LqRoouplkwgeOVjFBIRp.svg', // Ant Financial
    'https://gw.alipayobjects.com/zos/rmsportal/TLCyoAagnCGXUlbsMTWq.svg', // People's Daily
    'https://gw.alipayobjects.com/zos/rmsportal/HmCGMKcJQMwfPLNCIhOH.svg', // Cisco
    'https://gw.alipayobjects.com/zos/rmsportal/aqldfFDDqRVFRxqLUZOk.svg', // GrowingIO
    'https://gw.alipayobjects.com/zos/rmsportal/rqNeEFCGFuwiDKHaVaPp.svg', // Ele.me
    'https://gw.alipayobjects.com/zos/rmsportal/FdborlfwBxkWIqKbgRtq.svg', // Didi Chuxing
    'https://gw.alipayobjects.com/zos/rmsportal/coPmiBkAGVTuTNFVRUcg.png', // Feifan
  ],
};

export const footer = [
  {
    title: 'Ant Technology',
    children: [
      { title: 'Ant Financial Open Platform', link: 'https://open.alipay.com' },
      { title: 'Ant Experience Cloud', link: 'https://xcloud.alipay.com' },
      { title: 'Ant Financial Cloud', link: 'https://www.cloud.alipay.com' },
    ],
  },
  {
    title: 'Related Conferences',
    children: [
      { title: 'ATEC', link: 'https://atec.antfin.com' },
      { title: 'SEE Conf', link: 'https://seeconf.alipay.com' },
    ],
  },
  {
    title: 'Contact Us',
    children: [
      { title: 'Ant Experience Tech Column on Zhihu', link: 'https://zhuanlan.zhihu.com/xtech' },
      { title: 'Ant Experience Tech on Weibo', link: 'https://weibo.com/p/1005056420205486' },
      { title: 'AntV on Weibo', link: 'https://weibo.com/antv2017' },
      { title: 'Ant Design on Zhihu', link: 'https://zhuanlan.zhihu.com/antdesign' },
    ],
  },
  {
    title: 'Ant Experience Cloud',
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/wdarlDDcdCaVoCprCRwB.svg',
    children: [
      { title: 'Ant Design', desc: 'Ant UI System', link: 'https://ant.design' },
      { title: 'AntV', desc: 'Ant Data Visualization Solution', link: 'https://antv.alipay.com' },
      // { title: 'AntG', desc: 'Ant Interactive Graphics Technology', link: 'http://antg.alipay.net' },
      { title: 'Egg', desc: 'Enterprise-level Node Web Framework', link: 'https://eggjs.org' },
      { title: 'Yunfengdie', desc: 'Mobile Site Builder Platform', link: 'https://fengdie.alipay-eco.com/intro' },
    ],
  },
];
