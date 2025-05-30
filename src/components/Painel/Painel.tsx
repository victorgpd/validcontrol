import Screen from "../Screen/Screen";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { MenuProps } from "antd";
import { CalendarOutlined, DatabaseOutlined, HistoryOutlined, LogoutOutlined, PieChartOutlined, SettingOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { useRealtimeDocuments } from "../../hooks/useRealtimeDocuments";
import useAuthentication from "../../hooks/useAuthentication";

import { setLoja, setLojas, setOpenCurrentMenu, setSelectedLojaId } from "../../redux/globalReducer/slice";
import { RoutesEnum } from "../../enums/routes";

import { Container, Info, InfoContainer, MenuContainer, MenuList, PainelContainer, SelectStore } from "./styles";

import { WhereFilterOp } from "firebase/firestore";
import { StoresType, ValidityType } from "../../types/types";

type MenuItem = Required<MenuProps>["items"][number];

interface PainelProps {
  title?: string;
  children?: React.ReactNode;
}

const Painel = ({ children, title }: PainelProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { logout } = useAuthentication();
  const { user, openCurrentMenu, lojas, selectedLojaId } = useAppSelector((state) => state.globalReducer);

  const conditions = useMemo(() => {
    return user?.email ? [{ field: "access", op: "array-contains" as WhereFilterOp, value: user?.email }] : [];
  }, [user?.email]);

  const { documents } = useRealtimeDocuments("lojas", conditions);

  const [isVisible, setIsVisible] = useState(true);

  const [message, setMessage] = useState("");
  const [openCurrent, setOpenCurrent] = useState<string[]>(openCurrentMenu);

  const name = useMemo(() => {
    const firstName = user?.name?.split(" ")[0];
    return firstName || "";
  }, [user?.name]);

  const menuItems: MenuItem[] = [
    {
      key: "painel",
      label: "Painel",
      type: "group",
      children: [
        { key: "dashboard", icon: <PieChartOutlined />, label: "Dashboard", onClick: () => navigate(RoutesEnum.Dashboard) },
        {
          key: "products",
          label: "Produtos",
          icon: <ShoppingCartOutlined />,
          children: [
            { key: "product1", label: "Produtos cadastrados", onClick: () => navigate(RoutesEnum.Products) },
            { key: "product2", label: "Cadastrar novo produto", onClick: () => (window.location.href = RoutesEnum.Product_Create) },
          ],
        },
        {
          key: "validitys",
          label: "Validades",
          icon: <CalendarOutlined />,
          children: [
            { key: "validity1", label: "Validades cadastradas", onClick: () => navigate(RoutesEnum.Validitys) },
            { key: "validity2", label: "Cadastrar nova validade", onClick: () => (window.location.href = RoutesEnum.Validitys_Create) },
          ],
        },
      ],
    },
    {
      key: "data",
      label: "Dados",
      type: "group",
      children: [
        {
          key: "data",
          label: "Gerenciar Dados",
          icon: <DatabaseOutlined />,
          children: [
            { key: "data1", label: "Importar produtos", onClick: () => navigate(RoutesEnum.Data_Import) },
            { key: "data2", label: "Exportar produtos", onClick: () => navigate(RoutesEnum.Data_Export_Products) },
            { key: "data3", label: "Exportar validades", onClick: () => navigate(RoutesEnum.Data_Export_Validitys) },
          ],
        },
      ],
    },
    {
      key: "store",
      label: "Loja",
      type: "group",
      children: [
        {
          key: "logs",
          label: "Eventos",
          icon: <HistoryOutlined />,
          onClick: () => navigate(RoutesEnum.Logs),
        },
      ],
    },
    {
      key: "user",
      label: "Usuário",
      type: "group",
      children: [
        {
          key: "configuration",
          label: "Configurações",
          icon: <SettingOutlined />,
          onClick: () => navigate(RoutesEnum.Configuration),
        },
        {
          key: "logout",
          label: "Sair",
          icon: <LogoutOutlined />,
          style: { color: "red" },
          onClick: handleLogout,
        },
      ],
    },
  ];

  useEffect(() => {
    if (documents) {
      const stores: StoresType[] = [];

      documents.map((store: any) => {
        stores.push({
          store: store.store,
          access: store.access,
          idDocument: store.id,
        });
      });

      dispatch(setLojas(stores));

      const storeSelected = documents.find((store: any) => store.id === selectedLojaId);
      if (!storeSelected) return;

      const now = new Date();
      now.setHours(0, 0, 0, 0); // Zera o horário

      const aVencer: ValidityType[] = [];
      const vencidos: ValidityType[] = [];

      storeSelected.validitys.forEach((validade: ValidityType) => {
        if (!validade.date) return;

        const date = new Date(validade.date + "T00:00:00");
        if (isNaN(date.getTime())) return;

        if (date >= now) {
          aVencer.push(validade);
        } else {
          vencidos.push(validade);
        }
      });

      dispatch(
        setLoja({
          ...storeSelected,
          aVencer: [...aVencer],
          vencidos: [...vencidos],
          idDocument: storeSelected.id,
          createdAt: storeSelected.createdAt?.toDate().toISOString(),
          updatedAt: storeSelected.updatedAt?.toDate().toISOString(),
        })
      );
    }
  }, [documents, dispatch, selectedLojaId]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key == "selectedLojaId") {
        dispatch(setSelectedLojaId(e.newValue));
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    const selectedStore = localStorage.getItem("selectedLojaId");
    if (selectedStore) {
      dispatch(setSelectedLojaId(selectedStore));
    } else if (lojas && lojas.length > 0 && !selectedLojaId) {
      dispatch(setSelectedLojaId(lojas[0].idDocument || null));
    }
  }, [lojas, selectedLojaId]);

  useEffect(() => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
    setMessage(greeting);
  }, []);

  useEffect(() => {
    setOpenCurrent(openCurrentMenu);
  }, [openCurrentMenu]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 650) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate(RoutesEnum.Login);
  }

  const handleChangeLoja = (value: string) => {
    localStorage.setItem("selectedLojaId", value);
    dispatch(setSelectedLojaId(value)); // adiciona isso!
    setIsVisible(false);
  };

  const handleClickMenu: MenuProps["onClick"] = (e) => {
    dispatch(setOpenCurrentMenu(e.keyPath));
  };

  const toggleMenuVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <Screen painel={true} text={title} isVisible={isVisible} displayMenu={toggleMenuVisibility}>
      <MenuContainer isVisible={isVisible}>
        <InfoContainer>
          <Info className="greeting">
            {message}, {name}👋!
          </Info>
          <Info className="welcome">Seja bem-vindo ao seu painel!</Info>

          <SelectStore
            placeholder="Selecione uma loja"
            value={selectedLojaId}
            onChange={(value) => {
              if (value === selectedLojaId) return;
              if (value === "create") {
                navigate(RoutesEnum.CreateStore);
              } else {
                handleChangeLoja(`${value}`);
              }
            }}
            loading={!lojas}
            optionLabelProp="label"
            options={[
              {
                label: "Minhas Lojas",
                options:
                  lojas?.map((l) => ({
                    label: l.store,
                    value: l.idDocument,
                  })) || [],
              },
              {
                label: "Outras opções",
                options: [
                  {
                    label: "➕ Criar nova loja",
                    value: "create",
                  },
                ],
              },
            ]}
          />
        </InfoContainer>

        <MenuList onClick={handleClickMenu} selectedKeys={openCurrent} mode="inline" theme="light" items={menuItems} />
      </MenuContainer>

      <Container isVisible={isVisible} onClick={toggleMenuVisibility} />

      <PainelContainer isVisible={isVisible}>{children}</PainelContainer>
    </Screen>
  );
};

export default Painel;
