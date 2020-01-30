import app from './app';

app.listen(process.env.PORT, () => {
  console.log(`Server up! port: ${process.env.PORT}`);
});
