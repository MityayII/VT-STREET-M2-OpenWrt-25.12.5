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
	$(INSTALL_DIR) $(1)/etc/hotplug.d/iface
	$(INSTALL_BIN) ./files/etc/hotplug.d/iface/20-vt-mac $(1)/etc/hotplug.d/iface/20-vt-mac
endef

$(eval $(call BuildPackage,vtmodem))
