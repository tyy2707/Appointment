import { useEffect, useState } from "react";
import { Table, Input, Select, Image } from "antd";
import Constants from "../../../../utils/constants";
import DropdownOperation from "../../../../components/Dropdown/DropdownOperation";
import classes from './AccountUser.module.scss'
import Factories from "../../../../services/FactoryApi";
import { ToastNoti, getDate } from "../../../../utils/Utils";
import { Avatar } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const ManagerPatient = () => {
  const { Search } = Input;
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate()
  const fetchApiList = async (value) => {
    try {
      const response = await Factories.getListPatient(value);
      if (response) {
        setUserList(response);
      }
    } catch (error) {
      console.error("Error while fetching API:", error);
    }
  };
  function handleSearch() {
    fetchApiList(valueSearch)
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      fetchApiList(valueSearch);
    }
  };

  useEffect(() => {
    fetchApiList();
  }, []);

  function handleReload() {
    fetchApiList();
  }
  const [valueSearch, setValueSearch] = useState();

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      align: 'center',
      render: (id, record, index) => { ++index; return index; },
      showSorterTooltip: false,
    },
    // {
    //   title: 'Số tài khoản',
    //   width: 100,
    //   dataIndex: 'fullName',
    //   key: 'name',
    //   fixed: 'left',
    // },
    {
      title: 'Họ và tên',
      width: 170,
      dataIndex: 'fullName',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Ảnh',
      width: 100,
      dataIndex: 'avatar',
      key: 'name',
      render: text =>
        <Image className='shadow-md h-28' src={text} />
    },
    {
      title: 'Ngày sinh ',
      dataIndex: 'dateOfBirth',
      width: 130,
      key: 'dateOfBirth',
      render: (text) => (
        <div>{getDate(text)}</div>
      )
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      width: 130,
      key: 'phone',
    },
    {
      title: 'CCCD/CMT',
      dataIndex: 'CCCD',
      width: 130,
      key: 'phone',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      width: 130,
      render: (data) => <div>
        {Constants.optionSex.find(item => item.value === data)?.label}
      </div>,
    },
    {
      title: 'Công việc',
      dataIndex: 'job',
      width: 130,
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 130,
      key: 'phone',
    },
    {
      title: 'Tác vụ',
      key: 'operation',
      width: 130,
      align: 'center',
      render: (text) => (
        <button onClick={() => navigate(`/patient/${text._id}`)}> Xem chi tiết</button>)
    },
  ];

  const onChangeSelectHandler = async (value, id) => {
    try {
      const data = {
        status: value
      }
      const response = await Factories.updateStatus(data, id);
      if (response) {
        ToastNoti()
        fetchApiList()
      }
    } catch (error) {
      console.error("Error while fetching API:", error);
    }
  };


  return (
    <div className="p-5 flex flex-col gap-4">
      <div className={classes["header"]}>
        <div className={classes["titleTable"]}>
          <span className="text-3xl uppercase  font-bold text-blue">Danh sách bệnh nhân</span>
        </div>
        <div className={classes["searchInput"]}>
          <Search
            allowClear
            enterButton="Search"
            className="bg-white"
            onChange={(e) => setValueSearch(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            placeholder="Tìm kiếm với tên,...."
            onSearch={handleSearch} />
        </div>
      </div>

      <div className={'p-5 bg-[#fff] rounded-xl '} >
        <Table
          columns={columns}
          dataSource={userList ?? []}
        />
      </div>

    </div>
  );
};

export default ManagerPatient;
