import { ArrowLeft } from "lucide-react";

import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };
  return (
    <div>
      <button className="rounded-full bg-muted p-2" onClick={handleGoBack}>
        <ArrowLeft size={18} />
      </button>
    </div>
  );
};

export default BackButton;
