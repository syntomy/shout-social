import "./Home.css";
import { User } from "../../GlobalState/UserState";
import MainLayout from "../../Layouts/MainLayout";

function Home() {
  const user = User.use();

  return (
    <MainLayout>
      {JSON.stringify(user)}
    </MainLayout>
  );
}

export default Home;