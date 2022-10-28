import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import { number, string } from "yup/lib/locale";
import PopUpModal from "../../../components/PopUpModal/PopUpModal";
import { AppDispatch, RootState } from "../../../redux/configStore";
import { nguoiDungModel } from "../../../redux/models/nguoiDungModel";
import { deleteUserApi, getUserApi } from "../../../redux/reducers/nguoiDungReducer";
import { http } from "../../../util/setting";

type Props = {
 
};

export default function AdminUser({}: Props) {
  const { arrUser } = useSelector((state: RootState) => state.nguoiDungReducer);
  const { arrUserPaginated } = useSelector((state: RootState) => state.nguoiDungReducer);
  const dispatch: AppDispatch = useDispatch();
  let [searchParams, setSearchParams] = useSearchParams();
  const [arrUserSearch, setArrUserSearch] = useState(arrUser);
  let keywordRef = useRef("");
  const [pageNumber,setPageNumber] = useState(0)

  const usersPerPage=10
  const pagesVisited = pageNumber*usersPerPage
  const displayUsers = arrUser.slice(pagesVisited,pagesVisited+usersPerPage).map((user:nguoiDungModel,index:number)=>{
    return (
      <tr key={user.id}>
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.role}</td>
        <td>{user.email}</td>
        <td>{user.skill}</td>
        <td className="text-center px-5">
          {/* <button className="btn btn-success me-2">Xem thông tin</button> */}
          <button className="btn btn-primary me-2">Sửa</button>
          <button className="btn btn-danger" onClick={()=>{handleDelete(user.id,user)}
          }>Xóa</button>
        </td>
      </tr>
    );
  })


  const pageCount=Math.ceil(arrUser.length/usersPerPage)
  const changePage =({selected}:any)=>{
    setPageNumber(selected)
  }

  let keyword: any = searchParams.get("keyword");
  // console.log(keyword);
  
  const handleChange = (e: any) => {
    keywordRef.current = e.target.value;
    setSearchParams({ keyword: keywordRef.current });
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    setSearchParams({ keyword: keywordRef.current });

  };

  // const handleUpdate


  const handleDelete=(id:number,user:any)=>{
    const actionThunk = deleteUserApi(id,user)
    console.log(id);
    dispatch(actionThunk)
  }

  useEffect(() => {
    dispatch(getUserApi(keyword));
  }, [keywordRef.current]);

  

  return (
    <div className="adminuser">
      <h1><span  data-bs-toggle="modal" data-bs-target="#exampleModal">Thêm quản trị viên</span></h1>
      <form className="search" onSubmit={handleSubmit}>
        <input         
          onChange={handleChange}
          type="text"
          id="search"
          placeholder="Nhập vào tên người dùng"
        />
        <button type="submit">Tìm</button>
      </form>
      <table className="table table-striped">
        <thead>
          <tr >
            <th>Id</th>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Skill</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {displayUsers}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'Prev'}
        nextLabel={'Next'}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={'paginationBtn'}
        previousLinkClassName={'previousBtn'}
        nextLinkClassName={'nextBtn'}
        disabledClassName={'paginationDisabled'}
        activeClassName={'paginationActive'}
      />
      <PopUpModal/>
    </div>
  );
}
