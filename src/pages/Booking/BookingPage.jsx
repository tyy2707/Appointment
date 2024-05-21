import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import BookingAtFacility from "../../components/BookingChild/BookingAtFacility";
import BG1 from '../../assets/images/bg-book.png'
import { useForm } from "react-hook-form";
import ChooseSpecialty from "../../components/BookingChild/ChooseSpecialty";
import ChooseDoctor from "../../components/BookingChild/ChooseDoctor";
import ChooseService from "../../components/BookingChild/ChooseService";
import ChooseDate from "../../components/BookingChild/ChooseDate";
import ChooseProfile from "../../components/BookingChild/ChooseProfile";
import AppointmentInfo from "../../components/AppointmentInfo/AppointmentInfo";
import ValidatePayment from "../../components/BookingChild/ValidatePayment";
import { ToastNoti, ToastNotiError } from "../../utils/Utils";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Factories from "../../services/FactoryApi";
import { AuthContext } from "../../context/auth.context";
import { Breadcrumb } from "antd";
import { createNotification } from "../../services/FirebaseService";

const BookingPage = () => {
    const location = useLocation();
    // Lấy query string từ URL
    const searchParams = new URLSearchParams(location.search);
    // Lấy giá trị của tham số type từ query string
    const type = searchParams.get('type');
    const departId = searchParams.get('dp');
    const brandhId= searchParams.get('br');
    const { handleSubmit, setValue, watch, } = useForm();
    const [typeChoose, setType] = useState()
    const [step, setStep] = useState(1)
    console.log("🚀 ~ BookingPage ~ step:", step)
    const watchFacility = watch('Facility')
    const watchDataSubmit = watch()
    console.log("🚀 ~ BookingPage ~ watchDataSubmit:", watchDataSubmit)
    const watcDoctor = watch('Doctor')
    const watchSpecialty = watch('Specialty')
    const watchShift = watch('Shift')

    useEffect(() => {
        if (departId && brandhId) {
            setType(1)
            setValue('Type', 1)
            setValue('Specialty', departId)
            setValue('Facility', brandhId)
            setStep(4)
        }
    }, [departId,brandhId])

    useEffect(() => {
        if (type) {
            setType(type)
            setValue('Type', type)
            setStep(2)
        }
    }, [type])

    function handleChooseType(type) {
        setType(type)
        setValue('Type', type)
        setStep(2)
    }
    function handleChangeFacility(id) {
        setValue('Facility', id)
        setStep(3)
    }
    function handleChangeDoctor(id, step = 4) {
        setValue('Doctor', id)
        setStep(step)
    }
    function handleChangeSpecialty(id, step, branch) {
        setValue('Specialty', id)
        setValue('Branch', branch)
        setStep(step)
    }
    function handleChangeService(id, step) {
        setValue('Service', id)
        setStep(step)
    }
    function handleChangeDateTime(shift) {
        setValue('Shift', shift)
        setStep(7)
    }
    function handleChangeProfile(value) {
        setValue('Profile', value)
        setStep(8)
    }
    function handleGoback() {
        setStep(step > 1 ? step - 1 : 1)
    }

    const navigator = useNavigate()
    const { user } = useContext(AuthContext);
    async function handleSubmitBooking() {
        try {
            const newData = {
                user_id: user.id,
                patientId: watchDataSubmit.Profile._id,
                shiftId: watchDataSubmit.Shift.id,
                price: watchDataSubmit.Shift.price,
            }
            const response = await Factories.createBooking(newData)
            if (response?._id) {
                ToastNoti('Đặt lịch khám thành công')
                const noti = {
                    toId: watchDataSubmit.Doctor._id,
                    type: 1,
                    action_id: response?._id,
                }
                createNotification(noti)
                navigator(`/appointments/${response?._id}`)
            }
        } catch (error) {
            ToastNotiError()
        }
    }

    function onSubmit() { }

    const handleBreadcrumbClick = (title) => {
        // Xử lý các trường hợp tùy thuộc vào giá trị của step
        switch (title) {
            case 'Home':
                history.push('/');
                break;
            case 'Chọn chuyên khoa':
                setStep(type == '1' ? 3 : 4);
                break;
            case 'Chọn bác sĩ':
                setStep(type == '1' ? 4 : 3);
                break;
            case 'Chọn dịch vụ':
                setStep(5);
                break;
            case 'Chọn thời gian':
                setStep(6);
                break;
            case 'Chọn hồ sơ bệnh nhân':
                setStep(7);
                break;
            case 'Thông tin lượt khám':
                setStep(8);
                break;
            default:
                break;
        }
    };



    const breadcrumbItems = [
        {
            title: 'Home',
            onClick: () => handleBreadcrumbClick('Home'),
        },
        {
            title: 'Chọn chuyên khoa',
            onClick: () => handleBreadcrumbClick('Chọn chuyên khoa'),
            hidden: step < 3, // Ẩn nếu chưa trải qua bước này
        },
        {
            title: 'Chọn bác sĩ',
            onClick: () => handleBreadcrumbClick('Chọn bác sĩ'),
            hidden: step < 4, // Ẩn nếu chưa trải qua bước này
        },
        {
            title: 'Chọn dịch vụ',
            onClick: () => handleBreadcrumbClick('Chọn dịch vụ'),
            hidden: step < 5, // Ẩn nếu chưa trải qua bước này
        },
        {
            title: 'Chọn thời gian',
            onClick: () => handleBreadcrumbClick('Chọn thời gian'),
            hidden: step < 6, // Ẩn nếu chưa trải qua bước này
        },
        {
            title: 'Chọn hồ sơ bệnh nhân',
            onClick: () => handleBreadcrumbClick('Chọn hồ sơ bệnh nhân'),
            hidden: step < 7, // Ẩn nếu chưa trải qua bước này
        },
        {
            title: 'Thông tin lượt khám',
            onClick: () => handleBreadcrumbClick('Thông tin lượt khám'),
            hidden: step < 8, // Ẩn nếu chưa trải qua bước này
        },
    ];


    const breadcrumbItemsDoctor = [
        {
            title: 'Home',
            onClick: () => handleBreadcrumbClick('Home'),
        },
        {
            title: 'Chọn bác sĩ',
            onClick: () => handleBreadcrumbClick('Chọn bác sĩ'),
            hidden: step < 3, // Ẩn nếu chưa trải qua bước này
        },
        {
            title: 'Chọn chuyên khoa',
            onClick: () => handleBreadcrumbClick('Chọn chuyên khoa'),
            hidden: step < 4, // Ẩn nếu chưa trải qua bước này
        },
        {
            title: 'Chọn dịch vụ',
            onClick: () => handleBreadcrumbClick('Chọn dịch vụ'),
            hidden: step < 5, // Ẩn nếu chưa trải qua bước này
        },
        {
            title: 'Chọn thời gian',
            onClick: () => handleBreadcrumbClick('Chọn thời gian'),
            hidden: step < 6, // Ẩn nếu chưa trải qua bước này
        },
        {
            title: 'Chọn hồ sơ bệnh nhân',
            onClick: () => handleBreadcrumbClick('Chọn hồ sơ bệnh nhân'),
            hidden: step < 7, // Ẩn nếu chưa trải qua bước này
        },
        {
            title: 'Thông tin lượt khám',
            onClick: () => handleBreadcrumbClick('Thông tin lượt khám'),
            hidden: step < 8, // Ẩn nếu chưa trải qua bước này
        },
    ];

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {
                    step > 2 &&
                    <div className="flex w-full my-5 px-[20%] 2xl:px-[20%]  justify-start items-center">
                        {type == '1' ?
                            <Breadcrumb separator=">" items={breadcrumbItems.filter(item => !item.hidden)} />
                            :
                            <Breadcrumb separator=">" items={breadcrumbItemsDoctor.filter(item => !item.hidden)} />
                        }
                    </div>
                }


                {step === 1 &&
                    <div className="w-full flex flex-col justify-center items-center" style={{ background: `url(${BG1})`, backgroundSize: 'cover' }}>
                        <div className="w-[1000px] py-32 flex flex-col justify-center items-center">
                            <>
                                <span className='text-3xl py-8 text-blue2 font-bold '>
                                    ĐĂNG KÝ KHÁM BỆNH
                                </span>

                                {/* note */}
                                <div className="py-1 flex flex-col gap-2 max-w-[850px]">
                                    <span className="text-sm ">
                                        Quý khách hàng có nhu cầu đặt hẹn khám tại <Link className='text-base text-blue font-bold' to={'/'}>Hệ thống Đặt lịch khám bệnh Medpro</Link>, xin vui lòng thực hiện theo hướng dẫn:
                                    </span>
                                    <ul className="flex flex-col py-6 gap-3">
                                        <li
                                            className="ml-4"
                                            style={{
                                                listStyleType: 'disc'
                                            }}>
                                            Đặt hẹn bằng cách gọi tổng đài Chăm sóc khách hàng tại số 0287 102 6789 – 093 180 6858 (Bệnh viện Đa khoa Tâm Anh TPHCM) hoặc 024 3872 3872 – 024 7106 6858 (Bệnh viện Đa khoa Tâm Anh Hà Nội)
                                        </li>
                                        <li className="ml-4" style={{
                                            listStyleType: 'disc'
                                        }}>
                                            Đặt hẹn trực tuyến bằng cách điền thông tin vào mẫu bên dưới.
                                        </li>
                                        <li className="ml-4" style={{
                                            listStyleType: 'disc'
                                        }}>
                                            Xin lưu ý, trong các trường hợp khẩn cấp, quý khách vui lòng đến ngay cơ sở y tế gần nhất hoặc đến trực tiếp Hệ thống Đặt lịch khám bệnh Medpro
                                        </li>
                                    </ul>
                                </div>
                                <div className="pt-10 w-full  max-w-[850px] flex flex-row justify-between items-center gap-8">
                                    <button onClick={() => handleChooseType(1)} className="bg-[#fff] cursor-pointer text-left p-4 rounded-3xl border border-[#fff] shadow-md w-full">
                                        <span className=" flex flex-col text-xl font-bold text-blue2">
                                            Đặt khám theo cơ sở
                                        </span>
                                        <span className="text-sm text-gray w-full">
                                            Đặt khám nhanh chóng, tiết kiệm thời gian, an toàn tiện lợi
                                        </span>
                                    </button>
                                    <button onClick={() => handleChooseType(2)} className="bg-[#fff]  cursor-pointer text-left p-4 rounded-3xl border border-[#fff] shadow-md w-full">
                                        <span className=" flex flex-col text-xl font-bold text-blue2">
                                            Đặt khám theo bác sĩ
                                        </span>
                                        <span className="text-sm text-gray w-full">
                                            Chủ động chọn bác sĩ mà bạn tin tưởng, an tâm khám bệnh
                                        </span>
                                    </button>
                                </div>
                            </>
                        </div>
                    </div >
                }
                <div className="flex w-full">
                    <div className="flex w-full justify-center items-center   ">

                        {step === 2 &&
                            <BookingAtFacility type={typeChoose} onChangeFacility={(id) => handleChangeFacility(id)} />
                        }
                        {watchFacility && step === 3 && parseInt(typeChoose) === 1 &&
                            <ChooseSpecialty
                                value={watchFacility}
                                goBack={handleGoback}
                                onChangeSpecialty={(id, branch) => handleChangeSpecialty(id, 4, branch)}
                            />
                        }

                        {watchFacility && step === 3 && parseInt(typeChoose) === 2 &&
                            <ChooseDoctor
                                type={2}
                                goBack={handleGoback}
                                valueBranch={watchFacility}
                                onChangeDoctor={(id) => handleChangeDoctor(id)}
                            />
                        }
                        {watchSpecialty && typeChoose == 1 && step === 4 &&
                            <>
                                <ChooseDoctor
                                    goBack={handleGoback}
                                    valueBranch={watchFacility}
                                    value={watchSpecialty}
                                    onChangeDoctor={(id) => handleChangeDoctor(id, 5)}
                                />
                            </>
                        }
                        {(watcDoctor || watchSpecialty) && typeChoose == 2 && step === 4 &&
                            <ChooseSpecialty
                                value={watchFacility}
                                valueDoctor={watcDoctor?._id}
                                goBack={handleGoback}
                                onChangeSpecialty={(id, branch) => handleChangeSpecialty(id, 5, branch)}
                            />
                        }
                        {step === 5 &&
                            <ChooseService
                                value={watchFacility}
                                goBack={handleGoback}
                                data={watchDataSubmit}
                                onChangeService={(id) => handleChangeService(id, 6)}
                            />
                        }
                        {step === 6 &&
                            <ChooseDate
                                value={watchFacility}
                                data={watchDataSubmit}
                                goBack={handleGoback}
                                watch={watch}
                                onChange={(shift) => handleChangeDateTime(shift)}
                            />
                        }
                        {watchShift && step === 7 &&
                            <ChooseProfile
                                value={watchFacility}
                                onChange={(value) => handleChangeProfile(value)}
                                goBack={handleGoback}
                            />
                        }
                        {step === 8 &&
                            <AppointmentInfo
                                data={watchDataSubmit}
                                onClickPayment={() => setStep(9)}
                                goBack={handleGoback}
                            />
                        }
                        {step === 9 &&
                            <ValidatePayment
                                data={watchDataSubmit}
                                onClickSubmit={() => handleSubmitBooking()}
                                goBack={handleGoback}
                            />
                        }
                    </div>
                </div>
                {/* {step > 1 &&
                    <Button
                        startIcon={<ArrowBackIosNewIcon />}
                        className='w-28' onClick={() => handleGoback()}>
                        Quay lại
                    </Button>
                } */}

            </form>
        </>
    );
};

export default BookingPage;