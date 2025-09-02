import MetaData from "@/components/meta/MetaData";
import ComparePropertyPage from "@/components/pagescomponents/ComparePropertyPage";

const index = () => {
  return (
    <div>
      <MetaData
        title={`Compare Properties - ${process.env.NEXT_PUBLIC_META_TITLE}`}
        description={process.env.NEXT_PUBLIC_META_DESCRIPTION}
        keywords={process.env.NEXT_PUBLIC_META_KEYWORDS}
        pageName="/compare-properties"
      />
      <ComparePropertyPage />
    </div>
  );
};

export default index;
