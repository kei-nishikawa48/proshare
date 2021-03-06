import { useEffect } from 'react';
import Router from 'next/router';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import { SIGN_IN } from '../client_hooks/users';
import { useMutation } from '@apollo/client';
import { useCookies } from 'react-cookie';

const useStyles = makeStyles((theme) => ({
  background: {
    height: '100vh',
    display: 'flex',
    backgroundColor: '#4527A0',
    alignItems: 'center',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const [cookies, setCookie] = useCookies(['token']);
  useEffect(() => {
    cookies['token'] && Router.push('/');
  }, [cookies]);
  const [sign_in] = useMutation(SIGN_IN, {
    update: (_proxy, response) => {
      if (response.data.sign_in) {
        setCookie('token', response.data.sign_in.token);
      } else {
        alert('ログイン情報が不正です。');
      }
    },
  });

  const { register, handleSubmit } = useForm();
  const classes = useStyles();

  interface data {
    email: string;
    password: string;
  }
  const login = async (data: data) => {
    try {
      await sign_in({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
      history.back();
    } catch (er) {
      console.log(er);
    }
  };
  return (
    <div className={classes.background}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" style={{ color: '#fff' }}>
            Proshare
          </Typography>
          <form
            onSubmit={handleSubmit(login)}
            className={classes.form}
            noValidate
          >
            <TextField
              style={{ backgroundColor: '#fff' }}
              variant="filled"
              margin="normal"
              required
              fullWidth
              id="email"
              label={<span>メールアドレス</span>}
              name="email"
              autoComplete="email"
              autoFocus
              inputRef={register}
            />
            <TextField
              style={{ backgroundColor: '#fff' }}
              variant="filled"
              margin="normal"
              required
              fullWidth
              name="password"
              label={<span>パスワード</span>}
              type="password"
              id="password"
              autoComplete="current-password"
              inputRef={register}
            />
            {/* <FormControlLabel
              style={{ color: '#fff' }}
              control={<Checkbox value="remember" style={{ color: '#fff' }} />}
              label="次から入力を省略"
            /> */}
            <Button
              style={{ backgroundColor: '#EDE7F6', color: '#000' }}
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
            >
              サインイン
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2" style={{ color: '#EDE7F6' }}>
                  パスワードをお忘れですか？
                </Link>
              </Grid> */}
              <Grid item>
                <Link
                  variant="body2"
                  onClick={() => {
                    Router.push('/signup');
                  }}
                  style={{ color: '#EDE7F6', cursor: 'pointer' }}
                >
                  新規登録はこちらです
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
