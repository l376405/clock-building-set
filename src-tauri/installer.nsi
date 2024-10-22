Unicode true

; 基本信息
!define PRODUCT_NAME "時鐘產生器"
!define PRODUCT_VERSION "內部測試版"
!define PRODUCT_PUBLISHER "Hashirosabi"
!define PRODUCT_WEB_SITE "https://github.com/l376405/clock-building-set"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\clock-creator.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"

; MUI 現代界面定義
!include "MUI2.nsh"
!include "FileFunc.nsh"

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "clock-creator Installer.exe"
InstallDir "$PROGRAMFILES\clock-creator"
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show

; MUI 頁面
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; 語言文件
!insertmacro MUI_LANGUAGE "TradChinese"

; 安裝前關閉運行中的程序
Function CloseRunningApp
  FindWindow $0 "" "時鐘產生器"
  IntCmp $0 0 AppNotRunning
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION "時鐘產生器正在運行。$\n請關閉它然後點擊 '確定' 繼續，或點擊 '取消' 退出。" IDOK TryToClose IDCANCEL UserAbort
TryToClose:
  SendMessage $0 ${WM_CLOSE} 0 0
  Sleep 2000
  FindWindow $0 "" "時鐘產生器"
  IntCmp $0 0 AppNotRunning TryToClose TryToClose
UserAbort:
  Abort
AppNotRunning:
FunctionEnd

Section "MainSection" SEC01
  Call CloseRunningApp
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  File "target\release\clock-creator.exe"
  CreateDirectory "$SMPROGRAMS\時鐘產生器"
  CreateShortCut "$SMPROGRAMS\時鐘產生器\時鐘產生器.lnk" "$INSTDIR\clock-creator.exe"
  CreateShortCut "$DESKTOP\時鐘產生器.lnk" "$INSTDIR\clock-creator.exe"
SectionEnd

Section -AdditionalIcons
  WriteIniStr "$INSTDIR\${PRODUCT_NAME}.url" "InternetShortcut" "URL" "${PRODUCT_WEB_SITE}"
  CreateShortCut "$SMPROGRAMS\時鐘產生器\Website.lnk" "$INSTDIR\${PRODUCT_NAME}.url"
  CreateShortCut "$SMPROGRAMS\時鐘產生器\Uninstall.lnk" "$INSTDIR\uninst.exe"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\clock-creator.exe"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\clock-creator.exe"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr HKLM "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd

Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) 已成功地從你的電腦中移除。"
FunctionEnd

Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "你確定要完全移除 $(^Name) ，其及所有的組件嗎？" IDYES +2
  Abort
FunctionEnd

Function un.CloseRunningApp
  FindWindow $0 "" "時鐘產生器"
  IntCmp $0 0 AppNotRunning
  MessageBox MB_OKCANCEL|MB_ICONEXCLAMATION "時鐘產生器正在運行。$\n請關閉它然後點擊 '確定' 繼續，或點擊 '取消' 退出。" IDOK TryToClose IDCANCEL UserAbort
TryToClose:
  SendMessage $0 ${WM_CLOSE} 0 0
  Sleep 2000
  FindWindow $0 "" "時鐘產生器"
  IntCmp $0 0 AppNotRunning TryToClose TryToClose
UserAbort:
  Abort
AppNotRunning:
FunctionEnd

Section Uninstall
  Call un.CloseRunningApp
  Delete "$INSTDIR\${PRODUCT_NAME}.url"
  Delete "$INSTDIR\uninst.exe"
  Delete "$INSTDIR\clock-creator.exe"

  Delete "$SMPROGRAMS\時鐘產生器\Uninstall.lnk"
  Delete "$SMPROGRAMS\時鐘產生器\Website.lnk"
  Delete "$SMPROGRAMS\時鐘產生器\時鐘產生器.lnk"
  Delete "$DESKTOP\時鐘產生器.lnk"

  RMDir "$SMPROGRAMS\時鐘產生器"
  RMDir "$INSTDIR"

  DeleteRegKey HKLM "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  SetAutoClose true
SectionEnd