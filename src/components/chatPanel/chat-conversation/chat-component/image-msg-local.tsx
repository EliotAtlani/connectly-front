const ImageMessageLocal = ({ file }: { file: File }) => {
  return (
    <div className="w-44 h-44 my-2 flex items-center justify-center">
      <img
        src={URL.createObjectURL(file)}
        alt="message"
        className="max-w-44 max-h-44 object-cover rounded-md"
      />
    </div>
  );
};

export default ImageMessageLocal;
