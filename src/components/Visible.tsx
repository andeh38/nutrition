interface displayInterface {
  placeholder?: JSX.Element | undefined | null;
  when: any;
  children: JSX.Element;
}
const Display = ({ placeholder = null, when, children }: displayInterface) =>
  (typeof when === "boolean" ? when : Boolean(when)) ? children : placeholder;

export default Display;
