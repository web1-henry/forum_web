import { defineNuxtPlugin } from "#app";
import {
  ActionSheet,
  Button,
  Dialog,
  Empty,
  Icon,
  PullRefresh,
  Toast,
  Popup,
  Checkbox,
  ConfigProvider,
  Sticky,
  Uploader,
  Field,
  Overlay,
  Tag,
  Cell,
  CellGroup,
  List,
  Form,
  Search,
} from "vant";
import "vant/lib/index.css";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(Icon);
  nuxtApp.vueApp.use(Toast);
  nuxtApp.vueApp.use(Dialog);
  nuxtApp.vueApp.use(Button);
  nuxtApp.vueApp.use(PullRefresh);
  nuxtApp.vueApp.use(Empty);
  nuxtApp.vueApp.use(ActionSheet);
  nuxtApp.vueApp.use(Popup);
  nuxtApp.vueApp.use(Checkbox);
  nuxtApp.vueApp.use(ConfigProvider);
  nuxtApp.vueApp.use(Sticky);
  nuxtApp.vueApp.use(Uploader);
  nuxtApp.vueApp.use(Field);
  nuxtApp.vueApp.use(Overlay);
  nuxtApp.vueApp.use(Tag);
  nuxtApp.vueApp.use(Cell);
  nuxtApp.vueApp.use(CellGroup);
  nuxtApp.vueApp.use(List)
  nuxtApp.vueApp.use(Form)
  nuxtApp.vueApp.use(Search)
});
