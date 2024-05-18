import { useEffect, useState } from "react";
import { Table, Select, Button, Avatar, Input, Modal } from "antd";
import classes from "./AccountDoctor.module.scss";
import Constants from "../../../../utils/constants";
import AvatarGroup from "../../../../components/image-group/AvatarGroup";
import { toast } from "react-toastify";
import CategoriesFactories from "../../../../services/CategoriesFatories";
import DropdownOperation from "../../../../components/Dropdown/DropdownOperation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebase";
import { v4 } from "uuid";
import Factories from "../../../../services/FactoryApi";
import { ToastNoti, ToastNotiError } from "../../../../utils/Utils";
import StarRating from "../../../../components/start-rating/StarRating";

const AccountDoctor = () => {
  const [dataList, setDataList] = useState([]);
  console.log("🚀 ~ AccountDoctor ~ dataList:", dataList)
  const [valueSearch, setValueSearch] = useState();

  const fetchData = async (value) => {
    try {
      const response = await Factories.getAccountList(value, 2);
      if (response) {
        setDataList(response);
      } else {
        toast.error('Hệ thống lỗi')
        console.error("API response does not contain expected data:", response);
      }
    } catch (error) {
      toast.error('Hệ thống lỗi')
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function handleReload() {
    fetchData();
  }

  const [categoriesList, setCategoryList] = useState()
  useEffect(() => {
    // const fetchData = async () => {
    //   const response = await CategoriesFactories.getListCategories();
    //   const convertList = response?.map(item => ({
    //     value: item?.id,
    //     text: item?.name,
    //   }))
    //   setCategoryList(convertList);
    // };
  }, []);


  function handleSearch() {
    fetchData(valueSearch)
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      fetchData(valueSearch);
    }
  };

  const onChangeSelectHandler = (value, id) => {
    console.log(value, id)
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      fixed: 'left',
      align: 'center',
      render: (id, record, index) => { ++index; return index; },
      showSorterTooltip: false,
    },
    {
      title: 'Email',
      width: 140,
      dataIndex: 'email',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Họ và Tên',
      width: 140,
      dataIndex: 'fullName',
      key: 'name',
      fixed: 'left',
    },
    {
      title: 'Giớt tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 110,
      render: (data) => <div>
        {
          (data === 'Male' ? 'Nam' : (data === 2 ? 'Nữ' : 'Khác'))
        }
      </div>,
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
      width: 70,
      align: 'center',
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
      width: 130,
      key: 'phone',
    },
    {
      title: 'Khoa khám',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    // {
    //   title: 'Tỷ lệ',
    //   width: 160,
    //   dataIndex: 'rate',
    //   key: '7',
    //   // defaultSortOrder: 'descend',
    //   sorter: (a, b) => a.rateDone - b.rateDone,
    // },
    // {
    //   title: 'Đánh giá',
    //   dataIndex: 'star',
    //   width: 140,
    //   key: '7',
    //   defaultSortOrder: 'star',
    //   sorter: (a, b) => a.star - b.star,
    //   render: (star) => <StarRating starCount={star} />
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 220,
      filters: [
        {
          text: 'Đang hoạt động',
          value: 1,
        },
        {
          text: 'Khóa tài khoản',
          value: 2,
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (_, data) =>
        <Select
          style={{
            width: "100%",
          }}
          onChange={(value) => onChangeSelectHandler(value, data?.id)}
          value={data?.status}
          options={Constants.optionStatusAccount}
        />
    },
    {
      title: 'Tác vụ',
      key: 'operation',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <DropdownOperation record={record} type={2} updateSuccess={handleReload} />
      )
    },
  ];

  const [openModalAdd, setOpenModalAdd] = useState(false)
  const [fileUploadLink, setFileUploadLink] = useState();

  function handleChangeImage(file) {
    if (file === null || !file) {
      console.log('No file selected.');
      return;
    }
    const uniqueFileName = `${file.name}_${v4()}`;
    const imageRef = ref(storage, `avatar/${uniqueFileName}`);
    uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        setFileUploadLink(downloadURL)
      });
    }).catch((error) => {
      console.error('Error uploading file:', error);
    });
  }

  const onOpenModalAddField = () => {
    setOpenModalAdd(true)
  }
  const onCloseModalAddField = () => {
    setOpenModalAdd(false)
    fetchData();
  }

  const onAddCategorySubmit = async () => {
    const data = {
      // name: categoryAddName,
      // address: address,
      // image: fileUploadLink,
    }
    try {
      const resp = await Factories.createBranch(data);
      if (resp?.status === 200) {
        ToastNoti();
        fetchData()
        onCloseModalAddField()
      } else {
        ToastNotiError(resp?.message);
      }
    } catch (error) {
      ToastNotiError();
    }
  }

  function handleReset() {
    setValueSearch();
    fetchData()
  }
  return (
    <>
      <div className={classes["admin-user-container"]}>
        <div className={classes["header"]}>
          <div className={classes["titleTable"]}>
            <span className="text-3xl uppercase  font-bold text-blue">Danh sách bác sĩ</span>
          </div>
        </div>
        <div className="bg-[#fff] rounded-lg p-5 gap-10 w-full">
          <Input
            placeholder="Tìm kiếm theo mã, tên người thuê, ..."
            size="middle "
            value={valueSearch}
            className='w-[40%]'
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => setValueSearch(e.target.value)}
          />
          <Button
            variant="outlined"
            className="ml-2"
            onClick={handleReset}
          >
            Mặc định
          </Button>
          <Button
            className="ml-2 bg-blue text-[#fff]"
            variant="contained"
            onClick={onOpenModalAddField} >Thêm bác sĩ</Button>
          <Button
            className="ml-2 bg-blue text-[#fff]"
            variant="contained"
            onClick={handleSearch}
          >
            Tìm kiếm
          </Button>
        </div>
        <div className={classes["rowContent"]}>
          <Table
            columns={columns}
            dataSource={dataList ?? []}
          />
          <Modal
            width={800}
            title="Thêm bác sĩ mới"
            open={openModalAdd}
            onCancel={onCloseModalAddField}
            footer={[]}
          >
            <div className='flex flex-row'>
              <div className='flex flex-col my-2'>
                <input
                  id="uploadInput"
                  type="file"
                  className='uploadInput'
                  style={{ display: 'none' }}
                  onChange={(e) => handleChangeImage(e.target.files[0])}
                />
                <Avatar
                  src={fileUploadLink ?? ''}
                  alt="avatar"
                  style={{ width: 150, height: 150 }}
                />
                <label style={{ padding: '2px 50px', border: '1px solid #FAF8F1', borderRadius: 5 }} htmlFor="uploadInput" className='uploadButton'>
                  Upload
                </label>
              </div>
              <div className="flex w-full justify-between px-4 flex-col">
                <div className='flex flex-col'>
                  <Input
                    type="text"
                    style={{ width: '100%' }}
                    placeholder="Nhập tên lĩnh vực"
                    className='add-modal-input my-2'
                    // onChange={onChangeDataAddField}
                    name="name"
                  />
                  <Input
                    type="text"
                    style={{ width: '100%' }}
                    placeholder="Nhập địa chỉ"
                    className='add-modal-input my-2'
                    // onChange={onChangeDataAddress}
                    name="address"
                  />
                </div>
                <Button variant="contained" style={{ width: '100%', float: 'right' }} onClick={onAddCategorySubmit}>Thêm</Button>
              </div>

            </div>
          </Modal >
        </div>
      </div>
    </>
  );
};

export default AccountDoctor;
