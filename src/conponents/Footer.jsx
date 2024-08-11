import { Footer } from "flowbite-react";

const AppFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div className="flex mt-0 -mb-10">
    
          <Footer container className="mt-auto bg-neutral-800 dark:bg-slate-900 light:text-white">
        <Footer.Copyright
        className="text-white"
          by="Made With 💓 by Gitanshu Gautam"
          year={year}
        />
        
      </Footer>
    </div>
  );
}

export default AppFooter;