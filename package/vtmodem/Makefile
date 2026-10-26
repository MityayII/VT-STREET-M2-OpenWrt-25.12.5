include $(TOPDIR)/rules.mk

PKG_NAME:=vtmodem
PKG_VERSION:=1.0
PKG_RELEASE:=1

include $(INCLUDE_DIR)/package.mk

define Package/vtmodem
  SECTION:=net
  CATEGORY:=Network
  TITLE:=Vertell Hardware MAC Fallback Support
endef

define Build/Compile
endef

define Package/vtmodem/install
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/etc/init.d/vtmac $(1)/etc/init.d/vtmac

	$(INSTALL_DIR) $(1)/etc/rc.d
	ln -sf ../init.d/vtmac $(1)/etc/rc.d/S99vtmac
endef

$(eval $(call BuildPackage,vtmodem))
