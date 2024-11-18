// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useEffect } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import { useMutation } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { Local } from '../environment/env';
// import { toast } from 'react-toastify';
// import api from '../api/axiosInstance';
// import * as Yup from 'yup';

// const token = localStorage.getItem('token');

// const AddStaff: React.FC<{ close: () => void }> = ({ close }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//     }
//   }, []);

//   // API call to add a staff member
//   const addStaff = async (data: any) => {
//     try {
//       const response = await api.post(`${Local.ADD_STAFF}`, data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (err: any) {
//       toast.error(`${err.response?.message || 'Error occurred'}`);
//     }
//   };

//   const staffMutation = useMutation({
//     mutationFn: addStaff,
//     onSuccess: () => {
//       toast.success('Staff added successfully');
//       close();
//     },
//   });

//   const validationSchema = Yup.object().shape({
//     firstname: Yup.string().required('First name is required'),
//     lastname: Yup.string().required('Last name is required'),
//     gender: Yup.string().required('Gender is required'),
//     email: Yup.string().email('Invalid email address').required('Email is required'),
//     phoneNumber: Yup.string().required('Phone number is required'),
//   });

//   const staffHandler = (values: any) => {
//     staffMutation.mutate(values);
//     console.log('Staff added------->', staffMutation.data);
//   };

//   return (
//     <Formik
//       initialValues={{
//         firstname: '',
//         lastname: '',
//         gender: '',
//         email: '',
//         phoneNumber: '',
//       }}
//       validationSchema={validationSchema}
//       onSubmit={staffHandler}
//     >
//       {() => (
//         <Form>
//           <div className="form-group">
//             <label>First Name</label>
//             <Field type="text" name="firstname" className="form-control" />
//             <ErrorMessage name="firstname" component="div" className="text-danger" />
//           </div>
//           <br />

//           <div className="form-group">
//             <label>Last Name</label>
//             <Field type="text" name="lastname" className="form-control" />
//             <ErrorMessage name="lastname" component="div" className="text-danger" />
//           </div>
//           <br />

//           <div className="form-group">
//             <label>Gender</label>
//             <Field as="select" name="gender" className="form-control">
//               <option value="">Select gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="other">Other</option>
//             </Field>
//             <ErrorMessage name="gender" component="div" className="text-danger" />
//           </div>
//           <br />

//           <div className="form-group">
//             <label>Email</label>
//             <Field type="email" name="email" className="form-control" />
//             <ErrorMessage name="email" component="div" className="text-danger" />
//           </div>
//           <br />

//           <div className="form-group">
//             <label>Phone Number</label>
//             <Field type="text" name="phoneNumber" maxLength={10} className="form-control" />
//             <ErrorMessage name="phoneNumber" component="div" className="text-danger" />
//           </div>
//           <br />

//           <button type="submit" className="btn btn-outline-dark">
//             Submit
//           </button>
//         </Form>
//       )}
//     </Formik>
//   );
// };

// export default AddStaff;
