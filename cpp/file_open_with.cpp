#include <gio/gio.h>
#include <iostream>
#include <string>

int main(int argc, char **argv)
{
   const char *mimetype = g_content_type_guess(argv[1], NULL, 0, NULL);
   GList *list = g_app_info_get_all_for_type(mimetype);

   for (GList *l = list; l != NULL; l = l->next)
   {
      GAppInfo *appInfo = (GAppInfo *) l->data;
      const char *name = g_app_info_get_display_name(appInfo);
      const char *cmd = g_app_info_get_commandline(appInfo);

      std::string s_cmd(cmd);
      s_cmd = s_cmd.substr(0, s_cmd.find('%'));

      std::cout << name << '\t' << s_cmd << std::endl;

      delete name;
      delete cmd;
   }

   g_list_free(list);
   delete mimetype;
}
