import { useEffect, useState } from "react";
import { Table, Select, Avatar, Input, Modal, Form, DatePicker, Upload, message, Spin, Image } from "antd";
import classes from "./AccountDoctor.module.scss";
import Constants from "../../../../utils/constants";
import { toast } from "react-toastify";
import DropdownOperation from "../../../../components/Dropdown/DropdownOperation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebase";
import { v4 } from "uuid";
import Factories from "../../../../services/FactoryApi";
import { ToastNoti, ToastNotiError, uploadFirebase } from "../../../../utils/Utils";
import { LoadingOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import ButtonCustom from "../../../../components/Button/ButtonCustom";
import dayjs from "dayjs";
import { Button } from "@mui/material";
import StarRating from "../../../../components/start-rating/StarRating";
import Message from "../../../../components/UI/Message/Message";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const AccountDoctor = () => {
  const [dataList, setDataList] = useState([]);
  const [dataListBranch, setDataListBranch] = useState([]);
  const [valueSearch, setValueSearch] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const fetchData = async (value) => {
    setLoading(true)
    try {
      const response = await Factories.getAccountList(value, 2);
      if (response) {
        setDataList(response);
      } else {
        toast.error('Hệ thống lỗi')
        console.error("API response does not contain expected data:", response);
      }
      setLoading(false)
    } catch (error) {
      toast.error('Hệ thống lỗi')
      setLoading(false)
    }
  };

  const fetchDataBranch = async (keyword) => {
    try {
      const response = await Factories.getBranchList(keyword);
      if (response) {
        const newDate = response?.map(item => ({
          value: item._id,
          label: item.name,
        }))
        setDataListBranch(newDate);
      }
    } catch (error) {
      ToastNotiError(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataBranch()
  }, []);

  function handleReload() {
    fetchData();
  }

  function handleSearch() {
    fetchData(valueSearch)
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.keyCode === 13) {
      fetchData(valueSearch);
    }
  };
  const [check, setCheck] = useState({
    status: false,
    type: "",
    content: "",
  });
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
      title: 'Ảnh',
      width: 100,
      fixed: 'center',
      dataIndex: 'avatar',
      key: 'name',
      render: text =>
        <Image className='shadow-md rounded-full h-20' src={text} />
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
        {Constants.optionSex.find(item => item.value === data)?.label}
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
      title: 'Cấp bậc',
      dataIndex: 'academicRank',
      key: 'department',
      width: 150,
      render: (text) =>
        <Select
          style={{
            width: "100%",
          }}
          disabled
          value={parseInt(text)}
          options={Constants.levelDoctor}
        />
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
    //   // key: '7',
    //   defaultSortOrder: 'star',
    //   sorter: (a, b) => a.star - b.star,
    //   render: (star) => <StarRating starCount={star} />
    // },
    // {
    //   title: 'Khoa khám',
    //   dataIndex: 'department',
    //   key: 'department',
    //   width: 150,
    // },
    // {
    //   title: 'Trạng thái',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 220,
    //   filters: [
    //     {
    //       text: 'Đang hoạt động',
    //       value: 1,
    //     },
    //     {
    //       text: 'Khóa tài khoản',
    //       value: 2,
    //     },
    //   ],
    //   onFilter: (value, record) => record.status === value,
    //   render: (_, data) =>
    //     <Select
    //       style={{
    //         width: "100%",
    //       }}
    //       onChange={(value) => onChangeSelectHandler(value, data?.id)}
    //       value={data?.status}
    //       options={Constants.optionStatusAccount}
    //     />
    // },
    {
      title: 'Tác vụ',
      key: 'operation',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <DropdownOperation dataListBranch={dataListBranch} record={record} type={2} updateSuccess={handleReload} />
      )
    },
  ];

  const [openModalAdd, setOpenModalAdd] = useState(false)

  const onOpenModalAddField = () => {
    setOpenModalAdd(true)
  }
  const onCloseModalAddField = () => {
    setOpenModalAdd(false)
    fetchData();
  }

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
        value={84}
        defaultValue={"+84"}
      >
        <Option value="+84">+84</Option>
        <Option value="+86">+86</Option>
      </Select>
    </Form.Item>
  );

  function handleReset() {
    setValueSearch();
    fetchData()
  }


  const formItemLayout = {
    labelCol: {
      xs: {
        span: 24
      },
      sm: {
        span: 6,
      },
    },
    wrapperCol: {
      xs: {
        span: 12,
      },
      sm: {
        span: 24,
      },
    },
  };


  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 20,
        offset: 6,
      },
    },
  };

  function checkUserValidation(userInput) {
    if (!userInput.phone) {
      form.setError({
        status: true,
        type: "error",
        content: `Số điện thoại không được để trống.`,
      });
      return false;
    }

    else if (userInput.phone.length < 9 || userInput.phone.length > 10) {
      setCheck({
        status: true,
        type: "error",
        content: `Số điện thoại không đúng định dạng`,
      });
      return false;
    }
    return true;
  }
  const [form] = Form.useForm();
  const onFinish = async (data) => {
    if (checkUserValidation(data)) {
      try {
        setLoadingSubmit(true)
        const newData = { ...data }
        if (fileUpload) {
          const url = await uploadFirebase(fileUpload);
          if (url) {
            newData.avatar = url
          }
        }
        const response = await Factories.createDoctor(newData);
        if (response._id) {
          ToastNoti()
          setOpenModalAdd();
          fetchData()
        } else {
          ToastNotiError(response.error)
        }
        setFileUpload()
        setImageUrl()
        setLoadingSubmit(false)
      } catch (error) {
        setLoadingSubmit(false)
        fetchData()
        ToastNotiError(error);
      }
    }
  };
  const onFinishFailed = () => {
    message.error('Submit failed!');
  };

  const fill = () => {
    form.setFieldsValue({
      // name: 'Nguyễn Đặng Huy!',
      // phone: '0358014548',
      gender: 'Male',
      // email: 'Huynguyen222@gmail.com',
      date: '2001/12/12',
      academicRank: 2,
      dateOfBirth: dayjs('2001-04-13'),
      specialize: ['Tim mạch', 'Nội Tim mạch'],
      degree: ['Bằng tốt nghiệp đại học bách khoa hà nội'],
      experience: [
        'Tháng 7/1985-5/1987: Bác sĩ Chủ nhiệm Quân Y, Trường Cán bộ Trung cấp Quân chủng Phòng không – không quân.',
        'Tháng 6/1987-4/2000: Bác sĩ điều trị, Khoa Phẫu thuật bụng, Bệnh viện Trung ương Quân đội 108.',
        'Tháng 4/2000-3/2003: Chủ nhiệm khoa ngoại nhân dân, Bệnh viện Trung ương Quân đội 108, Chuyên viên Kỹ thuật Cục Quân Y – chuyên ngành phẫu thuật bụng.',
        'Tháng 6/2003-3/2014: Chủ nhiệm Khoa Ngoại Tổng hợp (B15) Bệnh viện Trung ương Quân đội 108, Giám đốc Trung tâm Phẫu thuật Nội soi, Giảng viên bộ môn Ngoại tiêu hóa Viện nghiên cứu Y Dược lâm sàng 108, Chuyên viên kỹ thuật Cục Quân Y – chuyên ngành Phẫu thuật bụng.',
        'Tháng 3/2014-6/2015: Phó chủ nhiệm Bộ môn Ngoại Tiêu hóa Viện nghiên cứu Y Dược lâm sàng 108, Chuyên viên Kỹ thuật Cục Quân Y – chuyên ngành Phẫu thuật bụng.',
        'Tháng 6/2015-7/2018: Viện trưởng Viện phẫu thuật tiêu hóa kiêm chủ nhiệm khoa Phẫu thuật Gan mật tụy, Phó chủ nhiệm Bộ môn Ngoại tiêu hóa Viện nghiên cứu Y Dược lâm sàng 108.'
      ],
      // introduction: ,
    });
  }

  useEffect(() => { fill() }, [])

  const [fileUpload, setFileUpload] = useState();
  const [imageUrl, setImageUrl] = useState();
  const handleChange = (e) => {
    setFileUpload(e.target.files[0])
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  };

  const changeMessage = () => {
    setCheck({
      status: false,
      type: "",
      content: "",
    });
  };

  return (
    <>

      <Message
        status={check.status}
        type={check.type}
        content={check.content}
        changeMessage={changeMessage}
      />

      <Modal
        width={800}
        title="Thêm bác sĩ mới"
        open={openModalAdd}
        onCancel={onCloseModalAddField}
        footer={[]}
      >
        <Form
          {...formItemLayout}
          variant="filled"
          onFinishFailed={onFinishFailed}
          form={form}
          onFinish={onFinish}
        >

          <div className="flex md:flex-row gap-10">
            <div className="flex md:w-full mt-4 flex-col gap-2">

              <Form.Item
                label="Họ và tên BS"
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: 'Bắt buộc nhập!',
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: 'Bắt buộc nhập!',
                  },
                ]}
              >
                <Input
                  addonBefore={prefixSelector}
                  style={{
                    width: '100%',
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Bắt buộc nhập!',
                  },
                  {
                    type: 'email',
                  },
                ]}
              >
                <Input type="email" />
              </Form.Item>



              <Form.Item
                name="gender"
                label="Giới tính"
                defaultvalue={'Male'}
                rules={[
                  {
                    required: true,
                    message: 'Chọn giới tính',
                  },
                ]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="Male">Nam</Option>
                  <Option value="Female">Nữ</Option>
                  <Option value="Other">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Ngày sinh"
                name="dateOfBirth"
              >
                <DatePicker placeholder="yyyy/mm/dd" />
              </Form.Item>


              <Form.Item
                label="Nơi làm việc"
                name="branchId"
                rules={[
                  {
                    required: true,
                    message: 'Bắt buộc nhập!',
                  },
                ]}
              >
                <Select
                  placeholder="Chọn nơi làm việc " options={dataListBranch} />
              </Form.Item>

              <Form.Item
                label="Cấp bậc"
                name="academicRank"
                rules={[
                  {
                    required: true,
                    message: 'Bắt buộc nhập!',
                  },
                ]}
              >
                <Select placeholder="Chọn trình độ" options={Constants.levelDoctor} />
              </Form.Item>


              <Form.List
                name="degree"
                label='Bằng cấp'
              // rules={[
              //   {
              //     validator: async (_, names) => {
              //       if (!names || names.length < 2) {
              //         return Promise.reject(new Error(''));
              //       }
              //     },
              //   },
              // ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Bằng cấp' : ''}
                        required={false}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Hãy nhập tên bằng cấp hoặc xoá field này.",
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            placeholder="Nhập tên bằng cấp / chứng chỉ"
                            style={{
                              width: '90%',
                              paddingRight: 20
                            }}
                          />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    <div className=" " style={{ marginLeft: 160 }}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{
                            width: '60%',
                          }}
                          icon={<PlusOutlined />}
                        >
                          Thêm bằng cấp
                        </Button>
                      </Form.Item>
                    </div>
                  </>
                )}
              </Form.List>

              <Form.List
                name="specialize"
                label='Lĩnh vực chuyên môn'
              // rules={[
              //   {
              //     validator: async (_, names) => {
              //       if (!names || names.length < 2) {
              //         return Promise.reject(new Error(''));
              //       }
              //     },
              //   },
              // ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Lĩnh vực chuyên môn' : ''}
                        required={false}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Hãy nhập lĩnh vực hoặc xoá field này.",
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            placeholder="Nhập tên lĩnh vực"
                            style={{
                              width: '90%',
                              paddingRight: 20
                            }}
                          />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    <div className=" " style={{ marginLeft: 160 }}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{
                            width: '60%',
                          }}
                          icon={<PlusOutlined />}
                        >
                          Thêm lĩnh vực
                        </Button>
                      </Form.Item>
                    </div>
                  </>
                )}
              </Form.List>



              <Form.List
                name="experience"
                label='Lĩnh vực chuyên môn'
              // rules={[
              //   {
              //     validator: async (_, names) => {
              //       if (!names || names.length < 2) {
              //         return Promise.reject(new Error(''));
              //       }
              //     },
              //   },
              // ]}
              >
                {(fields, { add, remove }, { errors }) => (
                  <>
                    {fields.map((field, index) => (
                      <Form.Item
                        {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                        label={index === 0 ? 'Kinh nghiệm làm việc' : ''}
                        required={false}
                        key={field.key}
                      >
                        <Form.Item
                          {...field}
                          validateTrigger={['onChange', 'onBlur']}
                          rules={[
                            {
                              required: true,
                              whitespace: true,
                              message: "Hãy nhập thông tin hoặc xoá field này.",
                            },
                          ]}
                          noStyle
                        >
                          <Input
                            placeholder="Nhập thông tin"
                            style={{
                              width: '90%',
                              paddingRight: 20
                            }}
                          />
                        </Form.Item>
                        {fields.length > 1 ? (
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Form.Item>
                    ))}
                    <div className=" " style={{ marginLeft: 160 }}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{
                            width: '60%',
                          }}
                          icon={<PlusOutlined />}
                        >
                          Thêm kinh nghiệm làm việc
                        </Button>
                      </Form.Item>
                    </div>
                  </>
                )}
              </Form.List>

              <Form.Item
                label="Giới thiệu về bác sĩ"
                name="introduction"
              >
                <Input.TextArea />
              </Form.Item>

            </div>
            <div className="flex h-32 flex-col">
              <input
                id="uploadInput"
                type="file"
                className='uploadInput'
                style={{ display: 'none' }}
                onChange={(e) => handleChange(e)}
              />
              <Image
                src={imageUrl ?? ''}
                alt="avatar"
                style={{ width: 150, height: 150 }}
                fallback="data:image/png;base64,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"
              />
              <label style={{ width: 150, padding: '2px 50px', border: '1px solid #111', borderRadius: 5 }} htmlFor="uploadInput" className='uploadButton'>
                Upload
              </label>
              {/* <Upload
                name="avatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      width: '100%',
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload> */}
            </div>
          </div>
          <Form.Item
            wrapperCol={{
              offset: 20,
              span: 24,
            }}
          >
            <ButtonCustom
              type='submit'
              loading={loadingSubmit}
              htmlType="submit"
            >
              Lưu thông tin
            </ButtonCustom>
          </Form.Item>

        </Form>
      </Modal >
      <div className={classes["admin-user-container"]}>
        <div className={classes["header"]}>
          <div className={classes["titleTable"]}>
            <span className="text-3xl uppercase  font-bold text-blue">Danh sách bác sĩ</span>
          </div>
        </div>
        <div className="bg-[#fff] flex flex-row justify-between rounded-lg p-5 gap-20 w-full">
          <Input
            placeholder="Tìm kiếm theo mã, tên người thuê, ..."
            size="middle "
            value={valueSearch}
            className='w-[40%]'
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => setValueSearch(e.target.value)}
          />
          <div className="flex flex-row gap-3">
            <Button
              variant="contained"
              className="ml-10"
              onClick={handleReset}
            >
              Mặc định
            </Button>
            <Button
              className="ml-2 bg-blue text-[#fff]"
              variant="contained"
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
            <Button
              className="ml-2 bg-blue text-[#fff]"
              variant="contained"
              loading={loadingSubmit}
              onClick={onOpenModalAddField} >Thêm bác sĩ</Button>
          </div>

        </div>
        <div className={classes["rowContent"]}>
          {loading ? <Spin></Spin> :
            <Table
              columns={columns}
              dataSource={dataList ?? []}
            />
          }

        </div>
      </div >
    </>
  );
};

export default AccountDoctor;
