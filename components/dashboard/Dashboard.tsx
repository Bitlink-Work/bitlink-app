import Banner from "./components/Banner/Banner";
import Content from "./components/Content/Content";

type Props = {};

const DashboardComponent = (props: Props) => {
  return (
    <div className="dashboard flex h-full w-full flex-col items-start justify-start gap-8 overflow-y-auto">
      <Banner />
      <Content />
    </div>
  );
};

export default DashboardComponent;
