import {
  Button,
  FormControl,
  FormGroup,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ICategory } from '../model/Categories';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '50%',
    margin: '5% 0 0 25%',
    '& > *': {
      marginTop: 20,
    },
  },
  formAdd: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputField: {
    width: '100%',
    margin: theme.spacing(1, 0),
  },
}));

const initialValue = {
  name: '',
  images: '',
  price: 0,
  categoryId: '',
  description: '',
};

export default function AddProduct() {
  const Schema = yup.object().shape({
    images: yup
      .string()
      .required('* Link hình ảnh không được để trống.')
      .trim(),
    name: yup
      .string()
      .required('* Tên sản phẩm không được để trống.')
      .min(6, '* Tên phải có ít nhất 6 kí tự.')
      .trim(),
    price: yup
      .number()
      .positive('* Giá bán phải là số dương.')
      .integer()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required('* Giá bán của sản phẩm không được để trống.')
      .min(0, '* Giá bán không được nhỏ hơn 0.'),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const [product, setProduct] = useState(initialValue);
  const { name, images, price, categoryId, description } = product;
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const classes = useStyles();
  let history = useHistory();

  const onValueChange = (e: any) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };
  const handleChange = (e: any) => {
    setProduct({ ...product, categoryId: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const AddProduct = async () => {
    await axios
      .post('http://localhost:8080/api/products', { ...product })
      .then((result) => {
        console.log(result);
        history.push('./dashboard');
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const loadCategory = async () => {
    await axios
      .get('http://localhost:8080/api/category')
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    loadCategory();
  }, []);
  return (
    <form onSubmit={handleSubmit(AddProduct)} className={classes.formAdd}>
      <FormGroup className={classes.container}>
        <Typography variant="h4">Add Product</Typography>
        <FormControl>
          <TextField
            {...register('name')}
            className={classes.inputField}
            placeholder="Vui long dien ten san pham"
            label="Ten san pham"
            variant="outlined"
            name="name"
            value={name}
            onChange={(e) => onValueChange(e)}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />
        </FormControl>
        <FormControl>
          <TextField
            {...register('images')}
            className={classes.inputField}
            placeholder="Vui long dien link hinh anh san pham"
            label="Link hinh anh"
            variant="outlined"
            name="images"
            value={images}
            onChange={(e) => onValueChange(e)}
            error={Boolean(errors.images)}
            helperText={errors.images?.message}
          />
        </FormControl>
        <FormControl>
          <TextField
            {...register('price')}
            className={classes.inputField}
            placeholder="Vui long dien gia ban san pham"
            label="Gia ban"
            variant="outlined"
            name="price"
            value={price}
            type="number"
            onChange={(e) => onValueChange(e)}
            error={Boolean(errors.price)}
            helperText={errors.price?.message}
          />
        </FormControl>
        <FormControl>
          <InputLabel id="demo-controlled-open-select-label">
            Category
          </InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={categoryId}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <MenuItem value={category.id}>{category.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <TextField
            className={classes.inputField}
            placeholder="Vui long dien mo ta san pham"
            label="Mo ta"
            variant="outlined"
            name="description"
            value={description}
            onChange={(e) => onValueChange(e)}
          />
        </FormControl>
        <FormControl>
          <Button variant="contained" color="primary" type="submit">
            Add
          </Button>
        </FormControl>
      </FormGroup>
    </form>
  );
}
